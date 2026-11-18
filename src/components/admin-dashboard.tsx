
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  X,
  Save,
  ExternalLink,
  Upload,
  Image as ImageIcon
} from "lucide-react";

type Specification = {
  parameter: string;
  value: string;
};

type P = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  material: string | null;
  accuracyClass: string | null;
  weightRange: string | null;
  imageUrl: string | null;
  specifications?: unknown;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const blank = {
  name: "",
  slug: "",
  category: "Standard Weights",
  summary: "",
  description: "",
  material: "",
  accuracyClass: "",
  weightRange: "",
  imageUrl: "",
  specifications: [] as Specification[],
  featured: false,
  active: true,
  sortOrder: 0
};

function normalizeSpecifications(value: unknown): Specification[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      parameter: typeof item.parameter === "string" ? item.parameter : "",
      value: typeof item.value === "string" ? item.value : ""
    }));
}

export function AdminDashboard({
  adminEmail,
  initialProducts
}: {
  adminEmail: string;
  initialProducts: P[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<P | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<any>(blank);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function open(p?: P) {
    setModalOpen(true);
    setEditing(p ?? null);

    setSelectedFile(null);
    setPreview(p?.imageUrl ?? "");

    setForm(
      p
        ? {
            ...p,
            material: p.material ?? "",
            accuracyClass: p.accuracyClass ?? "",
            weightRange: p.weightRange ?? "",
            imageUrl: p.imageUrl ?? "",
            specifications: normalizeSpecifications(p.specifications)
          }
        : { ...blank, specifications: [] }
    );

    setError("");
  }

  function change(k: string, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
  }

  function addSpecification() {
    setForm((f: any) => ({
      ...f,
      specifications: [
        ...(f.specifications || []),
        { parameter: "", value: "" }
      ]
    }));
  }

  function updateSpecification(
    index: number,
    field: keyof Specification,
    value: string
  ) {
    setForm((f: any) => ({
      ...f,
      specifications: f.specifications.map(
        (spec: Specification, i: number) =>
          i === index ? { ...spec, [field]: value } : spec
      )
    }));
  }

  function removeSpecification(index: number) {
    setForm((f: any) => ({
      ...f,
      specifications: f.specifications.filter(
        (_: Specification, i: number) => i !== index
      )
    }));
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleImageSelect(file: File) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be below 10 MB.");
      return;
    }

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  // Upload image to Cloudinary
  async function uploadImage(file: File): Promise<string> {
    const signatureResponse = await fetch(
      "/api/admin/uploads/signature",
      {
        method: "POST"
      }
    );

    const signatureData = await signatureResponse.json();

    if (!signatureResponse.ok) {
      throw new Error(
        signatureData.error || "Unable to authorize image upload."
      );
    }

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("api_key", signatureData.apiKey);
    uploadData.append("timestamp", String(signatureData.timestamp));
    uploadData.append("folder", signatureData.folder);
    uploadData.append("signature", signatureData.signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(
        uploadResult.error?.message || "Cloudinary upload failed."
      );
    }

    return uploadResult.secure_url;
  }

  // Save product
  async function save(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      let imageUrl = form.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const specifications = (form.specifications || [])
        .map((spec: Specification) => ({
          parameter: spec.parameter.trim(),
          value: spec.value.trim()
        }))
        .filter(
          (spec: Specification) => spec.parameter && spec.value
        );

      const payload = {
        ...form,
        imageUrl,
        specifications,
        sortOrder: Number(form.sortOrder)
      };

      const r = await fetch(
        editing
          ? `/api/admin/products/${editing.id}`
          : "/api/admin/products",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error || "Unable to save product.");
      }

      setProducts((old) =>
        editing
          ? old.map((p) =>
              p.id === editing.id ? d.product : p
            )
          : [...old, d.product]
      );

      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setEditing(null);
      setModalOpen(false);
      setSelectedFile(null);
      setPreview("");

    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to save product."
      );
    } finally {
      setBusy(false);
    }
  }

  // Delete product
  async function remove(p: P) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      return;
    }

    const r = await fetch(`/api/admin/products/${p.id}`, {
      method: "DELETE"
    });

    if (r.ok) {
      setProducts((old) =>
        old.filter((x) => x.id !== p.id)
      );
    } else {
      alert("Unable to delete this product.");
    }
  }

  // Logout admin
  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    router.replace("/admin/login");
    router.refresh();
  }

  // Close product modal
  function closeModal() {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview("");
    setEditing(null);
    setModalOpen(false);
    setError("");
  }

  // Search products
  const visible = products.filter((p) =>
    (p.name + " " + p.category)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="dashboard-side">

        <div className="dash-brand">
          <span className="brand-mark">R</span>

          <div>
            <b>RACHANA</b>
            <small>ADMIN CONSOLE</small>
          </div>
        </div>

        <div className="dash-side-label">
          WORKSPACE
        </div>

        <div className="dash-side-active">
          ▦ &nbsp; Product catalogue
        </div>

        <div className="dash-side-bottom">

          <span className="admin-avatar">
            {adminEmail.slice(0, 1).toUpperCase()}
          </span>

          <div>
            <b>{adminEmail}</b>
            <small>Administrator</small>
          </div>

          <button onClick={logout} title="Sign out">
            <LogOut size={16} />
          </button>

        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">

        <header className="dash-header">

          <div>
            <span className="eyebrow">
              RACHANA CORPORATION / ADMIN
            </span>

            <h1>Product catalogue</h1>
          </div>

          <a
            href="/"
            target="_blank"
            className="dash-view-site"
          >
            View website <ExternalLink size={15} />
          </a>

        </header>

        {/* Dashboard Stats */}
        <div className="dash-stats">

          <div>
            <span>TOTAL PRODUCTS</span>
            <b>
              {products.length.toString().padStart(2, "0")}
            </b>
          </div>

          <div>
            <span>PUBLISHED</span>
            <b>
              {products.filter((p) => p.active).length
                .toString()
                .padStart(2, "0")}
            </b>
          </div>

          <div>
            <span>FEATURED</span>
            <b>
              {products.filter((p) => p.featured).length
                .toString()
                .padStart(2, "0")}
            </b>
          </div>

        </div>

        {/* Toolbar */}
        <div className="dash-toolbar">

          <label className="search-box">
            <Search size={16} />

            <input
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <button
            className="button button-dark"
            onClick={() => open()}
          >
            <Plus size={16} /> Add product
          </button>

        </div>

        {/* Products Table */}
        <div className="dash-table-wrap">

          <table className="dash-table">

            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>WEIGHT RANGE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {visible.map((p) => (
                <tr key={p.id}>

                  <td>
                    <b>{p.name}</b>
                    <small>/{p.slug}</small>
                  </td>

                  <td>{p.category}</td>

                  <td>{p.weightRange || "—"}</td>

                  <td>

                    <span
                      className={`status-pill ${
                        p.active ? "published" : "draft"
                      }`}
                    >
                      {p.active ? "Published" : "Hidden"}
                    </span>

                    {p.featured && (
                      <span className="status-featured">
                        Featured
                      </span>
                    )}

                  </td>

                  <td>
                    <div className="row-actions">

                      <button
                        onClick={() => open(p)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => remove(p)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {visible.length === 0 && (
            <div className="empty-state">
              No products match this search.
            </div>
          )}

        </div>

      </main>

      {/* Add/Edit Product Modal */}
      {modalOpen && (

        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="product-modal">

            <div className="modal-head">

              <div>
                <span className="eyebrow">
                  CATALOGUE MANAGEMENT
                </span>

                <h2>
                  {editing ? "Edit product" : "Add a product"}
                </h2>
              </div>

              <button onClick={closeModal}>
                <X />
              </button>

            </div>

            <form
              onSubmit={save}
              className="product-editor"
            >

              <div className="editor-grid">

                {/* Product Name */}
                <label>
                  Product name *

                  <input
                    required
                    value={form.name}
                    onChange={(e) => {
                      change("name", e.target.value);

                      if (!editing) {
                        change("slug", slugify(e.target.value));
                      }
                    }}
                  />
                </label>

                {/* Slug */}
                <label>
                  URL slug *

                  <input
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    value={form.slug}
                    onChange={(e) =>
                      change("slug", e.target.value)
                    }
                  />
                </label>

                {/* Category */}
                <label>
                  Category *

                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      change("category", e.target.value)
                    }
                  />
                </label>

                {/* Weight Range */}
                <label>
                  Weight range

                  <input
                    value={form.weightRange}
                    onChange={(e) =>
                      change("weightRange", e.target.value)
                    }
                  />
                </label>

                {/* Material */}
                <label>
                  Material

                  <input
                    value={form.material}
                    onChange={(e) =>
                      change("material", e.target.value)
                    }
                  />
                </label>

                {/* Accuracy Class */}
                <label>
                  Accuracy class

                  <input
                    value={form.accuracyClass}
                    onChange={(e) =>
                      change("accuracyClass", e.target.value)
                    }
                  />
                </label>

                {/* Product Image Upload */}
                <div className="editor-full">

                  <label>Product image</label>

                  <div
                    style={{
                      border: "1px dashed #bbb",
                      borderRadius: "10px",
                      padding: "18px",
                      marginTop: "8px",
                      textAlign: "center"
                    }}
                  >

                    {preview ? (

                      <img
                        src={preview}
                        alt="Product preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "220px",
                          objectFit: "contain",
                          margin: "0 auto 15px"
                        }}
                      />

                    ) : (

                      <div style={{ padding: "20px" }}>

                        <ImageIcon
                          size={35}
                          style={{ margin: "0 auto 10px" }}
                        />

                        <p>No product image selected</p>

                      </div>

                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          handleImageSelect(file);
                        }

                        e.target.value = "";
                      }}
                    />

                    <button
                      type="button"
                      className="button button-outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={16} />

                      {preview ? "Replace image" : "Choose image"}
                    </button>

                    <small
                      style={{
                        display: "block",
                        marginTop: "10px"
                      }}
                    >
                      JPG, PNG or WebP. Maximum size: 10 MB.
                    </small>

                  </div>

                </div>

                {/* Summary */}
                <label className="editor-full">
                  Short summary *

                  <input
                    required
                    maxLength={240}
                    value={form.summary}
                    onChange={(e) =>
                      change("summary", e.target.value)
                    }
                  />
                </label>

                {/* Description */}
                <label className="editor-full">
                  Full description *

                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      change("description", e.target.value)
                    }
                  />
                </label>

                {/* Dynamic Specifications */}
                <div className="editor-full specifications-editor">

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px"
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>
                        Technical Specifications
                      </h3>

                      <small>
                        Add any number of specification rows.
                      </small>
                    </div>

                    <span>
                      {(form.specifications || []).length} rows
                    </span>
                  </div>

                  {/* Table Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 42px",
                      gap: "10px",
                      padding: "10px",
                      background: "#f1f4f8",
                      borderRadius: "8px 8px 0 0",
                      fontWeight: 600,
                      fontSize: "13px"
                    }}
                  >
                    <span>Parameter</span>
                    <span>Specification</span>
                    <span></span>
                  </div>

                  {/* Dynamic Rows */}
                  {(form.specifications || []).map(
                    (spec: Specification, index: number) => (

                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 42px",
                          gap: "10px",
                          alignItems: "center",
                          padding: "10px",
                          borderBottom: "1px solid #e5e9ef"
                        }}
                      >

                        <input
                          value={spec.parameter}
                          placeholder="e.g. Material"
                          maxLength={120}
                          onChange={(e) =>
                            updateSpecification(
                              index,
                              "parameter",
                              e.target.value
                            )
                          }
                        />

                        <input
                          value={spec.value}
                          placeholder="e.g. SS 316L"
                          maxLength={500}
                          onChange={(e) =>
                            updateSpecification(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          title="Remove specification"
                          onClick={() =>
                            removeSpecification(index)
                          }
                          style={{
                            border: "none",
                            background: "#fff1f1",
                            color: "#c62828",
                            borderRadius: "7px",
                            height: "38px",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    )
                  )}

                  {/* Add Row Button */}
                  <button
                    type="button"
                    className="button button-outline"
                    disabled={(form.specifications || []).length >= 100}
                    onClick={addSpecification}
                    style={{ marginTop: "14px" }}
                  >
                    <Plus size={16} />
                    Add Specification Row
                  </button>

                  <small
                    style={{
                      display: "block",
                      marginTop: "8px",
                      color: "#777"
                    }}
                  >
                    Empty rows will be ignored when saving.
                    Maximum 100 rows per product.
                  </small>

                </div>

                {/* Sort Order */}
                <label>
                  Display order

                  <input
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(e) =>
                      change("sortOrder", e.target.value)
                    }
                  />
                </label>

                {/* Checkboxes */}
                <div className="editor-checks">

                  <label>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        change("featured", e.target.checked)
                      }
                    />
                    Featured
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) =>
                        change("active", e.target.checked)
                      }
                    />
                    Published
                  </label>

                </div>

              </div>

              {/* Error Message */}
              {error && (
                <p className="form-message error">
                  {error}
                </p>
              )}

              {/* Modal Actions */}
              <div className="modal-actions">

                <button
                  type="button"
                  className="button button-outline"
                  onClick={closeModal}
                  disabled={busy}
                >
                  Cancel
                </button>

                <button
                  className="button button-dark"
                  disabled={busy}
                >
                  <Save size={16} />

                  {busy ? "Uploading & Saving…" : "Save product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
