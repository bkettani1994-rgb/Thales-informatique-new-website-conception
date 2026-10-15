// Données partagées entre le composant serveur (page.tsx — métadonnées, JSON-LD)
// et le composant client (RasTvaClient.tsx — rendu). Fichier sans "use client"
// pour rester importable depuis le serveur sans embarquer le bundle client.

export const SEUIL_DATE_ISO = "2027-01-01T00:00:00+01:00"; // palier 350 MDH, heure de Casablanca (UTC+1 toute l'année)

export const faqs: { q: string; a: string }[] = [
  {
    q: "Mon entreprise est-elle concernée ?",
    a: "Si vous êtes un organisme public, une banque, une assurance, une entreprise qui dépasse le seuil de chiffre d'affaires en vigueur pour son secteur, ou si vous facturez ces organisations : oui.",
  },
  {
    q: "Que se passe-t-il pendant la démo ?",
    a: "Un consultant Thalès Informatique échange avec vous pendant 20 minutes pour comprendre votre contexte et vous présenter le fonctionnement du module sur votre logiciel de gestion.",
  },
  {
    q: "Combien coûte la solution ?",
    a: "Le tarif dépend de votre logiciel de gestion et de votre configuration. Nous vous communiquons une proposition personnalisée à l'issue du diagnostic.",
  },
  {
    q: "Et si la loi évolue encore ?",
    a: "Nos équipes suivent les évolutions réglementaires et accompagnent nos clients pour que leur solution reste à jour.",
  },
];
