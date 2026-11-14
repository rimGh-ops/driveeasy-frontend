export interface TopVehiculeStat {
  vehiculeId: number;
  immatriculation: string;
  marqueModele: string;
  nombreLocations: number;
  revenuGenere: number;
}

export interface Statistiques {
  chiffreAffairesTotal: number;
  chiffreAffairesMois: number;
  totalLocations: number;
  locationsEnCours: number;
  locationsReservees: number;
  locationsTerminees: number;
  tauxOccupationParc: number;
  topVehicules: TopVehiculeStat[];
}
