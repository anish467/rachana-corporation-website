
import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await getAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check all product fields." },
      { status: 400 }
    );
  }

  const p = parsed.data;

  try {
    const product = await db.product.update({
      where: { id },
      data: {
        ...p,
        material: p.material || null,
        accuracyClass: p.accuracyClass || null,
        weightRange: p.weightRange || null,
        imageUrl: p.imageUrl || null,
        specifications: p.specifications
      }
    });

    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/", "layout");

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Could not update product. Check the slug is unique." },
      { status: 409 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await getAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deletedProduct = await db.product.delete({
      where: { id }
    });

    revalidatePath("/products");
    revalidatePath(`/products/${deletedProduct.slug}`);
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }
}
