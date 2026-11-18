
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { enquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { error: "Invalid request origin." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  const payload = body as Record<string, unknown>;
  const token = payload.turnstileToken;

  const parsed = enquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the required fields and try again." },
      { status: 400 }
    );
  }

  const {
    name,
    company,
    email,
    phone,
    subject,
    message,
    website
  } = parsed.data;

  if (website) {
    return NextResponse.json({ ok: true });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const allowedHosts = (process.env.TURNSTILE_HOSTNAMES || "")
    .split(",")
    .map(host => host.trim())
    .filter(Boolean);

  if (!secret || allowedHosts.length === 0) {
    return NextResponse.json(
      { error: "Security verification is not configured." },
      { status: 503 }
    );
  }

  if (typeof token !== "string" || !token || token.length > 2048) {
    return NextResponse.json(
      { error: "Please complete the security verification." },
      { status: 400 }
    );
  }

  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          secret,
          response: token
        }),
        cache: "no-store"
      }
    );

    const result = await verification.json();

    if (
      !verification.ok ||
      result.success !== true ||
      result.action !== "contact" ||
      !allowedHosts.includes(result.hostname)
    ) {
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Turnstile verification failed:", error);

    return NextResponse.json(
      { error: "Security verification unavailable. Please try again." },
      { status: 503 }
    );
  }

  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_TO_EMAIL ||
    !process.env.CONTACT_FROM_EMAIL
  ) {
    return NextResponse.json(
      { error: "Enquiry email is not configured yet." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safe = (s: string) => s.replace(/[<>]/g, "");

  try {
    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Website enquiry${subject ? `: ${safe(subject)}` : ""} — ${safe(name)}`,
      text: [
        `Name: ${safe(name)}`,
        `Company: ${safe(company || "Not provided")}`,
        `Email: ${safe(email)}`,
        `Phone: ${safe(phone || "Not provided")}`,
        `Subject: ${safe(subject || "Not provided")}`,
        "",
        "Message:",
        message
      ].join("\n")
    });

    if (result.error) throw new Error(result.error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry email failed:", error);

    return NextResponse.json(
      {
        error: "We couldn't send your enquiry right now. Please try again."
      },
      { status: 502 }
    );
  }
}
