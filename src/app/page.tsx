import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Layers3, Microscope, MoveUpRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import heroImage from "./hero-weights.png";
import {
  FileText,
  Download
} from "lucide-react";
export default async function Home() {
  const products = await getProducts({ featured: true });
  return (
    <>


      <section className="home-hero">
        <div className="home-hero-grid" aria-hidden="true" />

        {/* Background Product Image */}
        <div className="home-hero-image-bg" aria-hidden="true">
          <img
            src={heroImage.src}
            alt=""
            className="hero-image"
          />
        </div>

        <Container className="home-hero-layout">
          <div className="home-hero-copy">
            <div className="home-eyebrow">
              <span /> PRECISION WEIGHING · EST. 1998
            </div>

            <h1>
              Accuracy is not<br />
              an option. It is<br />
              <em>our standard.</em>
            </h1>

            <p>
              Standard weights, calibration weights and weighing solutions for
              laboratories, pharmaceutical facilities and industry.
            </p>

            <div className="home-hero-actions">
              <Button href="/products" variant="dark">
                Explore our products <ArrowUpRight size={17} />
              </Button>

              <Button
                href="/contact"
                variant="text"
                className="home-secondary-link"
              >
                Talk to our team <ArrowRight size={16} />
              </Button>
            </div>

            {/* <div className="home-hero-note">
              <span className="home-note-rule" />
              <span>
                SUPPORTING PRECISION-LED WORKPLACES ACROSS INDIA
              </span>
            </div> */}
          </div>
        </Container>

        <Container className="home-hero-foot">
          <span>STANDARD WEIGHTS & WEIGHING EQUIPMENT</span>
          <span>
            SCROLL TO DISCOVER <MoveUpRight size={13} />
          </span>
        </Container>
      </section>



      <section className="home-proof-strip">
        <Container className="home-proof-grid">
          <div><span className="proof-big">1998</span><span className="proof-small">Established</span></div>
          <div><span className="proof-big">E1—M1</span><span className="proof-small">Accuracy classes</span></div>
          <div><span className="proof-big">NABL</span><span className="proof-small">Accredited laboratory*</span></div>
          <div><span className="proof-big">INDIA</span><span className="proof-small">Based in Indore</span></div>
        </Container>
      </section>
      <section className="home-nabl-section">
        <Container className="home-nabl-layout">

          <Reveal className="home-nabl-content">
            <div className="home-nabl-eyebrow">
              <span />
              QUALITY & CALIBRATION
            </div>

            <Heading eyebrow="OUR IN-HOUSE LABORATORY">
              Precision backed by
              <br />
              <em>accredited expertise.</em>
            </Heading>

            <p className="home-nabl-description">
              Rachana Corporation operates an in-house NABL accredited
              calibration laboratory, equipped to provide calibration
              facilities for standard weights across accuracy classes
              E2 to M2. Our laboratory supports reliable measurement,
              traceability and confidence in weighing applications.
            </p>

            <div className="home-nabl-classes">
              <span>E2</span>
              <span>F1</span>
              <span>F2</span>
              <span>M1</span>
              <span>M2</span>
            </div>

            <div className="home-nabl-documents">

              <a
                href="https://res.cloudinary.com/dubztdfp6/image/upload/v1794921729/Certificate_CC-4586.pdf_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="nabl-document-link"
              >
                <div className="nabl-document-icon">
                  <FileText />
                </div>
                <div>
                  <strong>NABL Accreditation Certificate</strong>
                  <small>View accreditation certificate (PDF)</small>
                </div>
                <Download className="nabl-download-icon" />
              </a>

              <a
                href="https://res.cloudinary.com/dubztdfp6/image/upload/v1794928400/Scope-123670-CC-4586-1764157069.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="nabl-document-link"
              >
                <div className="nabl-document-icon">
                  <FileText />
                </div>
                <div>
                  <strong>NABL Scope of Accreditation</strong>
                  <small>View approved calibration scope (PDF)</small>
                </div>
                <Download className="nabl-download-icon" />
              </a>

            </div>
          </Reveal>

          <Reveal className="home-nabl-visual">
            <div className="nabl-visual-card">
              <img
                src="https://res.cloudinary.com/dubztdfp6/image/upload/v1794933528/assorted-bgremoved.png"
                alt="Rachana Corporation NABL Accredited Laboratory"
                className="nabl-certificate-image"
              />
            </div>
          </Reveal>

        </Container>
      </section>

      <Section className="home-products-section">
        <Container>
          <Reveal className="home-section-heading">
            <Heading eyebrow="01 / PRODUCT RANGE">Precision products.<br /><em>Practical solutions.</em></Heading>
            <div className="home-heading-side">
              <p>Explore weighing products selected for laboratory, pharmaceutical and industrial applications.</p>
              <Button href="/products" variant="text">View complete catalogue <ArrowRight size={16} /></Button>
            </div>
          </Reveal>
          <div className="product-grid">{products.slice(0, 4).map((product, index) => <Reveal key={product.id} delay={index * 0.06}><ProductCard product={product} index={index} /></Reveal>)}</div>
          <div className="home-catalogue-link"><span>NEED A SPECIFIC CAPACITY OR ACCURACY CLASS?</span><Button href="/contact" variant="text">Send us your requirement <ArrowUpRight size={15} /></Button></div>
        </Container>
      </Section>

      <section className="home-story-section">
        <Container className="home-story-layout">
          <Reveal>
            <div className="home-story-art"><div className="story-art-ring ring-one" /><div className="story-art-ring ring-two" /><div className="story-art-center"><span>RC</span><small>EST. 1998</small></div><div className="story-art-index">INDORE<br />MADHYA PRADESH</div><div className="story-art-mark">26 YEARS<br />OF EXPERIENCE</div></div>
          </Reveal>
          <Reveal className="home-story-copy">
            <Heading eyebrow="02 / THE RACHANA APPROACH" light>Built on experience.<br />Focused on <em>accuracy.</em></Heading>
            <p>Since 1998, Rachana Corporation has been helping customers source standard weights and weighing equipment with a focus on product suitability, dependable quality and responsive support.</p>
            <div className="home-story-points">
              <div><CheckCircle2 /><span>Product guidance around application and accuracy class</span></div>
              <div><CheckCircle2 /><span>Solutions for laboratories and industrial users</span></div>
              <div><CheckCircle2 /><span>Customer support from enquiry to supply</span></div>
            </div>
            <Button href="/about" variant="light">Discover Rachana <ArrowUpRight size={16} /></Button>
          </Reveal>
        </Container>
      </section>

      <Section className="home-capabilities">
        <Container>
          <Reveal className="home-section-heading">
            <Heading eyebrow="03 / WHY RACHANA">Confidence in every<br /><em>measurement.</em></Heading>
            <p className="home-heading-description">Choosing the right weighing solution starts with understanding what the application demands.</p>
          </Reveal>
          <div className="home-capability-grid">
            <Reveal><div className="home-capability-number">01</div><div className="home-capability-icon"><ShieldCheck /></div><h3>Quality-minded selection</h3><p>Product options aligned with the required application, material and accuracy class.</p></Reveal>
            <Reveal delay={0.08}><div className="home-capability-number">02</div><div className="home-capability-icon"><Microscope /></div><h3>Metrology focus</h3><p>A product range centred on standard weights, calibration needs and weighing applications.</p></Reveal>
            <Reveal delay={0.16}><div className="home-capability-number">03</div><div className="home-capability-icon"><Layers3 /></div><h3>Range that serves industry</h3><p>From precision weight sets to industrial test weights and weighing equipment.</p></Reveal>
          </div>
        </Container>
      </Section>

      <section className="home-contact-cta">
        <Container className="home-cta-layout">
          <Heading eyebrow="04 / START A CONVERSATION" light>Have a weighing<br /><em>requirement?</em></Heading>
          <div>
            <p>Tell us what you are looking for. We will help you explore the right product and configuration.</p>
            <Button href="/contact" variant="light">Request an enquiry <ArrowUpRight size={17} /></Button>
          </div>
          <span className="home-cta-watermark">RC.</span>
        </Container>
      </section>
      <Container className="home-disclaimer">*Please refer to the current NABL accreditation scope for applicable calibration services.</Container>
    </>
  );
}
