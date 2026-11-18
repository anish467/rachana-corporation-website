# Rachana Corporation — production website

A Next.js App Router website for Rachana Corporation with a public product catalogue, product detail pages, contact-by-email form, and a password-protected product administration dashboard.

## Included

- Responsive light-theme corporate website: Home, Products, Product details, About, Contact.
- Searchable and category-filtered catalogue.
- Admin login and CRUD dashboard for products (create, edit, publish/hide, feature, delete).
- PostgreSQL persistence via Prisma.
- Signed, HTTP-only, SameSite=Strict admin session cookie; bcrypt password hashes.
- Enquiry form delivered through Resend; no WhatsApp integration.
- SEO metadata, sitemap, robots.txt, Open Graph defaults.
- Demo product records and local product-art placeholders. Replace these with approved company product photographs before launch.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- PostgreSQL database (Supabase, Neon, Railway, or another managed PostgreSQL provider)
- Resend account and a verified sender domain for contact email delivery

## Run locally

1. Install Node.js 22 LTS.
2. Copy `.env.example` to `.env` and fill in the values.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the database schema and generate Prisma Client:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

   If this is a fresh local database and you prefer a first migration, this command creates the migration from `prisma/schema.prisma`.

5. Seed the starter catalogue:

   ```bash
   npm run db:seed
   ```

6. Create the admin login:

   ```bash
   npm run admin:create
   ```

   This reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Use a unique password of at least 12 characters. Do not commit `.env`.

7. Start the website:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. Admin: http://localhost:3000/admin/login.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret, at least 32 characters; use `openssl rand -base64 48` |
| `ADMIN_EMAIL` | Initial admin email used by `npm run admin:create` |
| `ADMIN_PASSWORD` | Initial admin password used by `npm run admin:create` |
| `RESEND_API_KEY` | Resend API key for contact enquiries |
| `CONTACT_TO_EMAIL` | Destination inbox, default intended: `rachanacorporation@gmail.com` |
| `CONTACT_FROM_EMAIL` | Sender address on a domain verified in Resend |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://rachanacorporation.com` |

## Deploy to Vercel + custom domain

1. Push this project to a private GitHub repository.
2. Create a managed PostgreSQL database (Supabase or Neon are suitable). Copy its pooled/runtime connection string into `DATABASE_URL`. For Prisma migrations, also configure a direct connection string if your provider supplies separate pooled and direct URLs; if using Prisma's direct URL workflow, add `directUrl = env("DIRECT_URL")` to the datasource and set `DIRECT_URL` accordingly.
3. In Vercel, import the GitHub repository and select the Next.js framework preset.
4. Add all production environment variables from the table above. Set `NEXT_PUBLIC_SITE_URL=https://rachanacorporation.com`.
5. Run database migrations against the production database from a trusted local terminal or CI job:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run db:seed
   npm run admin:create
   ```

   Set the production `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in that terminal's environment before running the commands. Do not put credentials in source control. Run the seed once; it does not overwrite existing product edits.
6. Deploy from Vercel. Build command: `npm run build`; output is managed by Next.js.
7. In Vercel → Project → Settings → Domains, add `rachanacorporation.com` and `www.rachanacorporation.com`. Follow the exact DNS records Vercel displays at your domain registrar. Choose one canonical domain and configure the other to redirect.
8. Wait for DNS/SSL verification, then test `https://rachanacorporation.com`, `/products`, `/contact`, and `/admin/login`.

### Resend setup

1. Create a Resend account and add/verify the sending domain you control.
2. Publish the DNS records Resend provides (SPF/DKIM and any recommended records).
3. Set `CONTACT_FROM_EMAIL` to an address on that verified domain (for example `website@rachanacorporation.com`), `CONTACT_TO_EMAIL` to `rachanacorporation@gmail.com`, and `RESEND_API_KEY` in Vercel.
4. Submit a real test enquiry and confirm it arrives. Replies go to the customer's submitted email address.

## Admin usage

- Open `/admin/login` and sign in with the admin account created by `npm run admin:create`.
- Add, edit, publish/hide, feature, reorder or delete products.
- Use a publicly accessible HTTPS image URL in the Image URL field. The site currently uses designed abstract product-art placeholders if no image URL is supplied. Replace these with real Rachana product photographs for launch.
- Use unique URL slugs such as `e1-stainless-steel-weights`.

## Before launch checklist

- [ ] Confirm the company address, telephone number and email shown in the footer/contact page.
- [ ] Replace placeholder product artwork with real product photographs and verify each product's actual range, material and accuracy class.
- [ ] Review all product descriptions and availability claims; the starter catalogue is a structured draft, not a stock/price list.
- [ ] Confirm NABL wording and current accreditation scope before publishing the accreditation statement.
- [ ] Verify Resend sender-domain DNS and send a live enquiry test.
- [ ] Set a strong unique admin password and a new random `AUTH_SECRET`.
- [ ] Configure database backups and monitoring with the database provider.
- [ ] Submit sitemap `https://rachanacorporation.com/sitemap.xml` to Google Search Console after launch.

## Security / operational notes

- Admin passwords are hashed with bcrypt; session cookies are HTTP-only, Secure in production, SameSite=Strict, and expire after eight hours.
- Admin API routes require a valid signed admin session. Product writes are validated server-side with Zod.
- Contact requests validate the request origin, validate inputs, and include a honeypot field. For high-volume public traffic, add a managed rate limiter (e.g. Upstash Redis) and CAPTCHA/Turnstile.
- Admin login currently does not include MFA or a managed distributed rate limiter. For a high-risk environment, add MFA and distributed login throttling before launch.
- Product image management accepts external HTTPS URLs; it does not include binary upload/storage. A later iteration can connect Cloudinary or Supabase Storage.
- The website is prepared for deployment, but it is not live until you connect the database, email provider, hosting project and domain DNS.
