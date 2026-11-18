
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/products";
import { ProductArt } from "@/components/product-art";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);

  return {
    title: p?.name ?? "Product",
    description: p?.summary ?? "Rachana Corporation product details",
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);

  if (!p) notFound();

  const specifications = Array.isArray("specifications" in p ? p.specifications : null)
    ? p.specifications.filter(
        (item): item is { parameter: string; value: string } =>
          typeof item === "object" &&
          item !== null &&
          "parameter" in item &&
          "value" in item &&
          typeof item.parameter === "string" &&
          typeof item.value === "string"
      )
    : [];

  return (
    <>
      <section className="detail-top">
        <div className="container">

          <div className="breadcrumb">
            <Link href="/">HOME</Link>
            <span>/</span>
            <Link href="/products">PRODUCTS</Link>
            <span>/</span>
            {p.category.toUpperCase()}
          </div>

          <Link className="back-link" href="/products">
            <ArrowLeft size={15} /> Back to products
          </Link>

          <div className="detail-grid">

            <div className="detail-art">
              <ProductArt
                name={p.name}
                index={p.sortOrder ?? 0}
                imageUrl={p.imageUrl}
              />
            </div>

            <div className="detail-copy">
              <span className="eyebrow">{p.category}</span>

              <h1>{p.name}</h1>

              <p className="detail-summary">{p.summary}</p>

              <p className="detail-description">{p.description}</p>

              <Link
                className="button button-dark"
                href={`/contact?product=${encodeURIComponent(p.name)}`}
              >
                Enquire about this product
                <ArrowUpRight size={17} />
              </Link>

              <span className="detail-note">
                <CheckCircle2 size={15} />
                Availability and specifications are confirmed against your
                requirement.
              </span>
            </div>

          </div>

          {/* Dynamic Technical Specifications */}

          {specifications.length > 0 && (
            <div className="technical-specifications">
              <div className="technical-specifications-heading">
                <span className="eyebrow">PRODUCT DETAILS</span>
                <h2>Technical Specifications</h2>
              </div>

              <div className="specifications-table-wrapper">
                <table className="specifications-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Specification</th>
                    </tr>
                  </thead>

                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={`${spec.parameter}-${index}`}>
                        <td>{spec.parameter}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      <section className="detail-bottom">
        <div className="container">
          <span className="eyebrow">NEED HELP CHOOSING?</span>
          <h2>
            Let's find the right
            <br />
            <em>configuration.</em>
          </h2>
          <Link className="text-link" href="/contact">
            Talk to our team <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
