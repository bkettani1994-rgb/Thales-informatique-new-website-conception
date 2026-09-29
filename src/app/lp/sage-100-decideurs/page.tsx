import type { Metadata } from "next";
import Sage100DecideursClient from "./Sage100DecideursClient";

const SITE_URL = "https://thales.ma";
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";
const TITLE = "Sage 100 pour dirigeants | Thalès Informatique";
const DESCRIPTION =
  "Découvrez comment Sage 100 aide les DG, DAF, DSI et responsables Achats/Ventes à piloter leur entreprise avec Thalès Informatique.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/lp/sage-100-decideurs" },
  // Page de destination publicitaire (LinkedIn Ads) — non indexée pour ne pas
  // entrer en concurrence SEO avec /solutions/sage-100.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: `${SITE_URL}/lp/sage-100-decideurs`,
    siteName: "Thalès Informatique",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Sage 100 — Thalès Informatique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return <Sage100DecideursClient />;
}
