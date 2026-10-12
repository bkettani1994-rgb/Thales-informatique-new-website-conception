// Données partagées entre le composant serveur (page.tsx — métadonnées, JSON-LD)
// et le composant client (RasTvaClient.tsx — rendu). Fichier sans "use client"
// pour rester importable depuis le serveur sans embarquer le bundle client.

export type Profile = "client" | "fournisseur" | "les_deux" | null;

export const SEUIL_DATE_ISO = "2027-01-01T00:00:00+01:00"; // palier 350 MDH, heure de Casablanca (UTC+1 toute l'année)

export const faqs: { q: string; a: string }[] = [
  {
    q: "Mon entreprise est-elle concernée ?",
    a: "Si vous êtes un établissement public, une banque, une assurance, une entreprise au-dessus des seuils (500 MDH depuis juillet 2026, 350 MDH au 1er janvier 2027, 200 MDH au 1er janvier 2028), ou si vous facturez ces organisations : oui, d'une manière ou d'une autre.",
  },
  {
    q: "Faut-il changer de version de Sage ?",
    a: "[À VALIDER : conditions de compatibilité du module selon la version Sage 100 / X3 / FRP 1000 installée]",
  },
  {
    q: "Combien de temps prend l'installation ?",
    a: "[À VALIDER : durée réelle d'installation et de paramétrage du module]",
  },
  {
    q: "Le module gère-t-il les services, les travaux et les biens d'équipement ?",
    a: "[À VALIDER : périmètre fonctionnel exact du module par type d'opération]",
  },
  {
    q: "Et si la loi évolue ?",
    a: "Nos équipes suivent les textes de la DGI et mettent à jour les modules [À VALIDER : modalités selon le contrat de maintenance].",
  },
  {
    q: "Le diagnostic est-il vraiment gratuit ?",
    a: "Oui : 30 minutes, en visio ou par téléphone, sans engagement.",
  },
];

export const milestones = [
  {
    date: "Juillet 2024",
    iso: "2024-07-01",
    label: "État, collectivités, établissements publics",
    desc: "Retenue par l'État, les collectivités et les établissements publics, et sur les prestataires personnes physiques.",
    highlight: false,
  },
  {
    date: "Juillet 2026",
    iso: "2026-07-01",
    label: "500 MDH et plus",
    desc: "Entreprises de 500 MDH de chiffre d'affaires et plus.",
    highlight: false,
  },
  {
    date: "1er janvier 2027",
    iso: "2027-01-01",
    label: "350 MDH et plus",
    desc: "Entreprises de 350 MDH et plus.",
    highlight: true,
  },
  {
    date: "1er janvier 2028",
    iso: "2028-01-01",
    label: "200 MDH et plus",
    desc: "Entreprises de 200 MDH et plus.",
    highlight: false,
  },
];
