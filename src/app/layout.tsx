import type {Metadata} from "next";
import {DM_Sans, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import {SiteChrome} from "@/components/site-chrome";

const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rachanacorporation.com"),
  title: {default: "Rachana Corporation | Precision Standard Weights", template: "%s | Rachana Corporation"},
  description: "Supplier of precision standard weights, calibration weights, weight boxes and industrial weighing equipment in India.",
  keywords: ["standard weights", "calibration weights", "OIML weights", "stainless steel weights", "weight boxes", "Rachana Corporation", "Indore"],
  openGraph: {type: "website", siteName: "Rachana Corporation", title: "Rachana Corporation | Accuracy You Deserve", description: "Precision standard weights and weighing solutions."},
  robots: {index: true, follow: true},
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
