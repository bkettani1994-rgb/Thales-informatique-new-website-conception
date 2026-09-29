import type { Metadata } from "next";
import "./globals.css";
import ChatBot from "@/components/ui/ChatBot";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import LinkedInInsightTag from "@/components/analytics/LinkedInInsightTag";
import AnalyticsEvents from "@/components/analytics/AnalyticsEvents";

const SITE_URL = "https://thales.ma";
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Thalès Informatique | Votre partenaire de transformation digitale",
    template: "%s | Thalès Informatique",
  },
  description:
    "Depuis plus de 30 ans, Thalès Informatique accompagne les entreprises en Afrique et à l'international dans leur transformation digitale : ERP, gestion financière, RH, production et plus.",
  icons: {
    icon: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780929211/logo_thales_informatique_favicon_amxxo8.png",
    shortcut: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780929211/logo_thales_informatique_favicon_amxxo8.png",
    apple: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780929211/logo_thales_informatique_favicon_amxxo8.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE_URL,
    siteName: "Thalès Informatique",
    title: "Thalès Informatique | Votre partenaire de transformation digitale",
    description:
      "Depuis plus de 30 ans, Thalès Informatique accompagne les entreprises en Afrique et à l'international dans leur transformation digitale : ERP, gestion financière, RH, production et plus.",
    images: [
      {
        url: OG_IMAGE,
        width: 800,
        height: 800,
        alt: "Thalès Informatique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thalès Informatique | Votre partenaire de transformation digitale",
    description:
      "Depuis plus de 30 ans, Thalès Informatique accompagne les entreprises en Afrique et à l'international dans leur transformation digitale : ERP, gestion financière, RH, production et plus.",
    images: [OG_IMAGE],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "Thalès Informatique",
  alternateName: "Thales Informatique",
  url: SITE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description:
    "Depuis plus de 30 ans, Thalès Informatique accompagne les entreprises en Afrique et à l'international dans leur transformation digitale : ERP Sage X3 et Sage 100, gestion financière, RH, paie, production et plus.",
  slogan: "Votre partenaire de transformation digitale",
  foundingDate: "1996",
  address: {
    "@type": "PostalAddress",
    streetAddress: "310 Rue Hadj Omar Riffi",
    addressLocality: "Casablanca",
    postalCode: "20120",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.5950,
    longitude: -7.6190,
  },
  telephone: "+212522548780",
  email: "contact@thales.ma",
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "29",
  },
  areaServed: [
    { "@type": "Continent", name: "Afrique" },
    { "@type": "Country", name: "Maroc" },
  ],
  knowsAbout: [
    "ERP",
    "Sage X3",
    "Sage 100",
    "Sage FRP 1000",
    "Gestion financière",
    "Ressources humaines",
    "Paie",
    "Transformation digitale",
  ],
  sameAs: [
    "https://www.linkedin.com/company/thalesinformatique/",
    "https://www.facebook.com/Thales.Informatique",
    "https://www.instagram.com/thales.informatique/",
    "https://www.youtube.com/@thalesinformatique1033",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <GoogleAnalytics />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased bg-bg-base text-primary">
        <AnalyticsEvents />
        <LinkedInInsightTag />
        {children}
        <ChatBot />
        <WhatsAppButton />
      </body>
    </html>
  );
}
