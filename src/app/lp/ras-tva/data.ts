// Données partagées entre le composant serveur (page.tsx — métadonnées, JSON-LD)
// et le composant client (RasTvaClient.tsx — rendu). Fichier sans "use client"
// pour rester importable depuis le serveur sans embarquer le bundle client.

export const SEUIL_DATE_ISO = "2027-01-01T00:00:00+01:00"; // palier 350 MDH, heure de Casablanca (UTC+1 toute l'année)

export const faqs: { q: string; a: string }[] = [
  {
    q: "Mon entreprise est-elle concernée ?",
    a: "Si vous êtes un organisme public, une banque, une assurance, une entreprise au-dessus des seuils (500 MDH depuis juillet 2026, 350 MDH au 1er janvier 2027, 200 MDH au 1er janvier 2028), ou si vous facturez ces organisations : oui.",
  },
  {
    q: "Que se passe-t-il pendant la démo ?",
    a: "20 minutes en visio avec un consultant Sage : nous regardons votre facturation et calculons votre cas concret. [À VALIDER : déroulé exact de la démo]",
  },
  {
    q: "Combien coûte la solution ?",
    a: "[À VALIDER : grille tarifaire du module RAS TVA]",
  },
  {
    q: "Et si la loi évolue encore ?",
    a: "Le module est mis à jour avec les évolutions réglementaires par nos équipes. [À VALIDER : politique de mise à jour et de maintenance]",
  },
];
