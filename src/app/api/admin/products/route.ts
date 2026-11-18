
import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validation";

export async function GET() {
  if (!await getAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!await getAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check all product fields." },
      { status: 400 }
    );
  }

  try {
    const p = parsed.data;

    const product = await db.product.create({
      data: {
        ...p,
        material: p.material || null,
        accuracyClass: p.accuracyClass || null,
        weightRange: p.weightRange || null,
        imageUrl: p.imageUrl || null,
        specifications: p.specifications
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create product. The slug may already be in use." },
      { status: 409 }
    );
  }
}
