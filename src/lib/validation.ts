
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  category: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(8).max(240),
  description: z.string().trim().min(10).max(5000),

  material: z.string().trim().max(120).optional().or(z.literal("")),
  accuracyClass: z.string().trim().max(120).optional().or(z.literal("")),
  weightRange: z.string().trim().max(120).optional().or(z.literal("")),

  imageUrl: z.string().trim().url().max(1000).optional().or(z.literal("")),

  specifications: z.array(
    z.object({
      parameter: z.string().trim().min(1).max(120),
      value: z.string().trim().min(1).max(500)
    })
  ).max(100).default([]),

  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0)
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional(),
  email: z.email().max(254),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional()
});
