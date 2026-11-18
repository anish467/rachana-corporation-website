import {ArrowUpRight, CheckCircle2, Target, ShieldCheck, Users} from "lucide-react";
import {Reveal} from "@/components/reveal";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {Heading} from "@/components/ui/heading";
import {Section} from "@/components/ui/section";

export const metadata = {title: "About us", description: "Learn about Rachana Corporation, a supplier of standard weights and weighing solutions since 2000."};

export default function About() {
  return (
    <>
      <section className="page-hero">
        <Container>
          <Heading as="h1" eyebrow="ABOUT RACHANA / 02">Grounded in experience.<br /><em>Focused on accuracy.</em></Heading>
          <p>Supplying standard weights and weighing solutions with a commitment to quality, reliability and customer relationships.</p>
          <div className="breadcrumb">HOME <span>/</span> ABOUT US</div>
        </Container>
      </section>
      <Section className="story-section">
        <Container className="story-grid">
          <Reveal>
            <Heading eyebrow="OUR STORY / SINCE 2000">Precision is more<br />than a specification.<br /><em>It&apos;s a responsibility.</em></Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="story-lead">Rachana Corporation was established in 2000 with a focus on standard weights and weighing-related products.</p>
            <p>Over the years, the business has served customers who depend on reliable weighing solutions for laboratory, industrial and quality-control applications. Our approach is centred on understanding requirements, helping customers select suitable products and supporting them with clear communication.</p>
            <p>We continue to build on that foundation with a product range spanning precision standard weights, industrial test weights, weight boxes and weighing equipment.</p>
          </Reveal>
        </Container>
      </Section>
      <section className="about-values">
        <Container>
          <span className="eyebrow eyebrow-light">WHAT GUIDES US</span>
          <div className="value-cards">
            <div><Target /><span>01 / ACCURACY</span><h3>Respect for precision</h3><p>We understand the role accurate weighing plays in quality and process control.</p></div>
            <div><ShieldCheck /><span>02 / QUALITY</span><h3>Quality-minded choices</h3><p>We focus on product suitability, material and accuracy requirements.</p></div>
            <div><Users /><span>03 / PARTNERSHIP</span><h3>Customer relationships</h3><p>We value responsive communication and long-term business relationships.</p></div>
          </div>
        </Container>
      </section>
      <Section className="credentials-section">
        <Container className="credentials-grid">
          <Heading eyebrow="QUALITY & METROLOGY">Supporting a culture<br />of <em>confidence.</em></Heading>
          <div>
            <div className="credential-mark">NABL</div>
            <h3>NABL-accredited laboratory</h3>
            <p>Rachana Corporation&apos;s laboratory is NABL accredited. For calibration services, scope and certificate applicability, please contact us or refer to the current accreditation documents.</p>
            <div className="credential-note"><CheckCircle2 size={16} /> Laboratory identification: CC-1896</div>
          </div>
        </Container>
      </Section>
      <section className="cta-section">
        <Container className="cta-inner">
          <Heading eyebrow="START A CONVERSATION" light>Let&apos;s work on<br /><em>what matters.</em></Heading>
          <div>
            <p>Tell us about your weighing requirement and we&apos;ll help you identify a suitable next step.</p>
            <Button href="/contact" variant="light">Contact Rachana <ArrowUpRight size={17} /></Button>
          </div>
        </Container>
      </section>
    </>
  );
}
