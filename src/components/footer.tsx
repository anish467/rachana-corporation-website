import Link from "next/link";
import {MapPin, Mail, Phone, ArrowUpRight} from "lucide-react";
import {Brand} from "@/components/brand";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-cta">
          <div>
            <span className="eyebrow">Enquiries</span>
            <h2>Need a specification or a quotation?</h2>
          </div>
          <Button href="/contact" variant="dark">
            Request an enquiry <ArrowUpRight size={16} />
          </Button>
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            <Brand light />
            <p>Precision weighing solutions, backed by experience and a commitment to accuracy.</p>
            <span className="footer-tag">ACCURACY YOU DESERVE.</span>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <h4>Explore</h4>
            <Link href="/products">Products</Link>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="footer-contact">
            <h4>Get in touch</h4>
            <p><MapPin size={15} /> 18 Siddharth Nagar, Bhawarkua Square, Indore, Madhya Pradesh 452001, India</p>
            <a href="tel:+919926734034"><Phone size={15} /> +91 99267 34034</a>
            <a href="mailto:rachanacorporation@gmail.com"><Mail size={15} /> rachanacorporation@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rachana Corporation. All rights reserved.</span>
          <Link href="/admin/login">Admin <ArrowUpRight size={13} /></Link>
          <span>Indore, India</span>
        </div>
      </Container>
    </footer>
  );
}
