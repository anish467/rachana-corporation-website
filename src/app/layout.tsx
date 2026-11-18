
import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rachanacorporation.com"
  ),
  title: {
    default: "Rachana Corporation | Precision Standard Weights",
    template: "%s | Rachana Corporation",
  },
  description:
    "Supplier of precision standard weights, calibration weights, weight boxes and industrial weighing equipment in India.",
  keywords: [
    "standard weights",
    "calibration weights",
    "OIML weights",
    "stainless steel weights",
    "weight boxes",
    "Rachana Corporation",
    "Indore",
  ],
  openGraph: {
    type: "website",
    siteName: "Rachana Corporation",
    title: "Rachana Corporation | Accuracy You Deserve",
    description: "Precision standard weights and weighing solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
