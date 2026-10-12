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
    q: "Faut-il changer de version de Sage ?",
    a: "[À VALIDER : conditions de compatibilité du module selon la version Sage 100 / X3 / FRP 1000 installée]",
  },
  {
    q: "Combien de temps prend l'installation ?",
    a: "[À VALIDER : durée réelle d'installation et de paramétrage du module]",
  },
  {
    q: "Le diagnostic est-il vraiment gratuit ?",
    a: "Oui : 30 minutes, en visio ou par téléphone, sans engagement.",
  },
];
