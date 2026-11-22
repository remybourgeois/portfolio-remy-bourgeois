// src/lib/data/clients.ts

/**
 * Le nom accompagne le logo : le marquee est décoratif (`aria-hidden`), et
 * c'est la liste des noms, hors écran, qu'un lecteur d'écran lit à sa place.
 * Sans elle, la région « Clients et partenaires » était vide à l'oreille.
 */
export interface Client {
  name: string;
  logo: string;
  /**
   * Dimensions intrinsèques du fichier. Le bandeau en tire la largeur de
   * chaque logo avant son chargement : sans elles, la piste s'élargissait à
   * chaque image reçue et son défilement, calé sur 50 % de sa largeur, sautait.
   */
  width: number;
  height: number;
}

export const CLIENTS: Client[] = [
  { name: 'Auchan', logo: '/assets/auchan.png', width: 158, height: 38 },
  { name: 'Aldebaran', logo: '/assets/aldebaran.svg', width: 1309, height: 267 },
  { name: 'Lagardère', logo: '/assets/lagardere.png', width: 164, height: 52 },
  { name: 'Crédit Agricole', logo: '/assets/ca.png', width: 138, height: 95 },
  { name: 'Canal+', logo: '/assets/canal.webp', width: 3764, height: 685 },
  { name: "Caisse d'Épargne", logo: '/assets/ce.png', width: 215, height: 56 },
  { name: 'EDF', logo: '/assets/edf.png', width: 142, height: 61 },
  { name: 'iPify', logo: '/assets/ipify.png', width: 630, height: 210 },
  { name: 'Ministère', logo: '/assets/ministere.png', width: 158, height: 58 },
  { name: 'Accor Live Limitless', logo: '/assets/all.png', width: 178, height: 55 },
  { name: 'Veolia', logo: '/assets/veolia.png', width: 186, height: 46 },
  { name: 'SNCF', logo: '/assets/sncf.png', width: 140, height: 74 },
  { name: 'Pernod Ricard', logo: '/assets/pernod.png', width: 212, height: 79 },
  { name: 'SFR', logo: '/assets/sfr.png', width: 94, height: 93 },
  { name: 'Ofelia', logo: '/assets/ofelia.svg', width: 3523, height: 1237 }
];
