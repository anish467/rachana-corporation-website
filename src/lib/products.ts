
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const demoProducts = [
  {
    id: "demo-10",
    slug: "indicators-load-cells",
    name: "Indicators & Load Cells",
    category: "Weighing Equipment",
    summary: "Components for weighing systems and industrial weighing applications.",
    description: "Indicators and load cells for weighing system requirements.",
    material: "Model dependent",
    accuracyClass: null,
    weightRange: "Multiple capacities",
    imageUrl: null,
    featured: false,
    active: true,
    sortOrder: 10,
  },
];

export async function getProducts(
  options: { featured?: boolean; activeOnly?: boolean } = {}
) {
  try {
    return await db.product.findMany({
      where: {
        ...(options.activeOnly === false ? {} : { active: true }),
        ...(options.featured ? { featured: true } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    console.error("getProducts database error:", error);
    return demoProducts.filter((p) =>
      options.featured ? p.featured : true
    );
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await db.product.findFirst({
      where: { slug, active: true },
    });
  } catch (error) {
    console.error("getProductBySlug database error:", error);
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
}
