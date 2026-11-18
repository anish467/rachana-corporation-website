"use client";

import {usePathname} from "next/navigation";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";

export function SiteChrome({children}: {children: React.ReactNode}) {
  const path = usePathname();
  if (path.startsWith("/admin")) return <main id="content">{children}</main>;
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
