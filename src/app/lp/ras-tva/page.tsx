import type { Metadata } from "next";
import RasTvaClient from "./RasTvaClient";
import { faqs } from "./data";

const SITE_URL = "https://thales.ma";
// [À VALIDER : image OG dédiée 1200x630 représentant le tampon R.A.S. — logo Thalès utilisé en attendant]
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";
const TITLE = "Module RAS TVA pour Sage 100, X3 et FRP 1000 | Thalès Informatique";
const DESCRIPTION =
  "Automatisez la retenue à la source de la TVA dans votre Sage. Diagnostic gratuit de 30 minutes avec un consultant Thalès Informatique.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/lp/ras-tva" },
  // Page de destination publicitaire (LinkedIn Ads) — non indexée, comme les autres landing pages du site.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: `${SITE_URL}/lp/ras-tva`,
    siteName: "Thalès Informatique",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Module RAS TVA — Thalès Informatique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\[À VALIDER[^\]]*\]/g, "").trim() },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RasTvaClient />
    </>
  );
}
