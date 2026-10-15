import type { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";

const SITE_URL = "https://thales.ma";
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";
const TITLE = "Demande envoyée | Thalès Informatique";
const DESCRIPTION = "Votre demande de diagnostic RAS TVA a bien été envoyée à Thalès Informatique.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/thank-you" },
  // Page de confirmation (post-conversion) — jamais indexée. URL courte et dédiée
  // pour servir de cible de règle de conversion dans LinkedIn Campaign Manager.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: `${SITE_URL}/thank-you`,
    siteName: "Thalès Informatique",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Thalès Informatique" }],
  },
};

export default function Page() {
  return <ThankYouClient />;
}
