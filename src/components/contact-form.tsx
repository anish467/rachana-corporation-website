
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Script from "next/script";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

export function ContactForm() {
  const params = useSearchParams();
  const product = params.get("product") || "";

  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("sending");
    setMessage("");

    const form = e.currentTarget;

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    const turnstileToken = data["cf-turnstile-response"];

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the security verification.");
      return;
    }

    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          turnstileToken
        })
      });

      const result = await r.json();

      if (!r.ok) {
        throw new Error(
          result.error || "Unable to send enquiry."
        );
      }

      setStatus("sent");
      setMessage(
        "Thank you. Your enquiry has been sent successfully."
      );

      form.reset();
    } catch (err) {
      setStatus("error");

      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      window.turnstile?.reset();
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="form-row">
        <label>
          Your name *
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Full name"
          />
        </label>

        <label>
          Company
          <input
            name="company"
            maxLength={120}
            placeholder="Company name"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Email address *
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@company.com"
          />
        </label>

        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            maxLength={30}
            placeholder="+91"
          />
        </label>
      </div>

      <label>
        Subject
        <input
          name="subject"
          maxLength={160}
          defaultValue={
            product ? `Enquiry: ${product}` : ""
          }
          placeholder="What is your enquiry about?"
        />
      </label>

      <label>
        Message *
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder="Tell us about the product, capacity, accuracy class or service you need…"
        />
      </label>

      {/* Honeypot field */}
      <div className="hp-field" aria-hidden="true">
        <label>
          Leave this field empty
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* Cloudflare Turnstile */}
      <div
        className="cf-turnstile"
        data-sitekey={
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        }
        data-theme="light"
        data-action="contact"
      />

      <button
        className="button button-dark form-submit"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? "Sending…"
          : "Send enquiry"}

        <ArrowUpRight size={17} />
      </button>

      {message && (
        <p
          className={`form-message ${status}`}
          role="status"
        >
          {status === "sent" && (
            <CheckCircle2 size={16} />
          )}

          {message}
        </p>
      )}

      <p className="form-privacy">
        Your details will only be used to respond to this enquiry.
      </p>
    </form>
  );
}
