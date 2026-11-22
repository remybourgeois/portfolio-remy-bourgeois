// src/lib/data/clients.ts

/**
 * Le nom accompagne le logo : le marquee est décoratif (`aria-hidden`), et
 * c'est la liste des noms, hors écran, qu'un lecteur d'écran lit à sa place.
 * Sans elle, la région « Clients et partenaires » était vide à l'oreille.
 */
export interface Client {
  name: string;
  logo: string;
}

export const CLIENTS: Client[] = [
  { name: 'Auchan', logo: '/assets/auchan.png' },
  { name: 'Aldebaran', logo: '/assets/aldebaran.svg' },
  { name: 'Lagardère', logo: '/assets/lagardere.png' },
  { name: 'Crédit Agricole', logo: '/assets/ca.png' },
  { name: 'Canal+', logo: '/assets/canal.webp' },
  { name: "Caisse d'Épargne", logo: '/assets/ce.png' },
  { name: 'EDF', logo: '/assets/edf.png' },
  { name: 'iPify', logo: '/assets/ipify.png' },
  { name: 'Ministère', logo: '/assets/ministere.png' },
  { name: 'Accor Live Limitless', logo: '/assets/all.png' },
  { name: 'Veolia', logo: '/assets/veolia.png' },
  { name: 'SNCF', logo: '/assets/sncf.png' },
  { name: 'Pernod Ricard', logo: '/assets/pernod.png' },
  { name: 'SFR', logo: '/assets/sfr.png' },
  { name: 'Ofelia', logo: '/assets/ofelia.svg' }
];
