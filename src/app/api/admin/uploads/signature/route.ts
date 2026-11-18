
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export async function POST() {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration is missing." },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "rachana-products";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloudName,
      apiKey
    });

  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      { error: "Unable to authorize image upload." },
      { status: 500 }
    );
  }
}
