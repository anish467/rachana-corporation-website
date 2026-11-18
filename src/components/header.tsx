"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Menu, X, ArrowUpRight} from "lucide-react";
import {Brand} from "@/components/brand";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";

const links = [
  {href: "/", label: "Home"},
  {href: "/products", label: "Products"},
  {href: "/about", label: "About us"},
  {href: "/contact", label: "Contact"},
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.header
      className="site-header"
      initial={{opacity: 0, y: -8}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
    >
      <Container className="nav-wrap">
        <Brand />
        <nav id="site-nav" className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => {
            const active = link.href === "/" ? path === "/" : path.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            );
          })}
          <Button href="/contact" variant="nav" onClick={() => setOpen(false)}>
            Request an enquiry <ArrowUpRight size={15} />
          </Button>
        </nav>
        <button
          className="mobile-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-nav"
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>
    </motion.header>
  );
}
