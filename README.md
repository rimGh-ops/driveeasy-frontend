# DriveEasy - Application Web Frontend (Angular)

Application web moderne développée en **Angular (Composants Standalone)** pour les agents de l'agence de location de voitures **DriveEasy**.

Cette application consomme l'ensemble des API REST **exclusivement via l'API Gateway** sur le port `8080`.

---

## 1. Fonctionnalités et Pages Réalisées

1. **Tableau de Bord (`/dashboard`)** :
   - Indicateurs en temps réel (KPIs) : Véhicules disponibles, loués, en maintenance.
   - Chiffre d'affaires mensuel et cumulé (TND).
   - Taux d'occupation dynamique du parc avec jauge visuelle.
   - Top véhicules les plus rentables et les plus loués.

2. **Catalogue des Véhicules (`/vehicules`)** :
   - Grille de cartes dynamiques avec photos et badges de disponibilité.
   - Filtres multi-critères : Recherche textuelle (marque/modèle), type de carburant, statut, prix plafond.
   - Fiches techniques (places, boîte, kilométrage, année).

3. **Formulaire Véhicule (`/vehicules/new` et `/vehicules/:id/edit`)** :
   - Formulaire réactif avec contrôles stricts (immatriculation obligatoire, année <= année courante, tarif > 0).

4. **Gestion des Clients (`/clients`)** :
   - Recherche en direct par nom, prénom, CIN ou email.
   - Badges de niveau de fidélité : `STANDARD`, `FIDELE` (-5%), `VIP` (-10%).
   - **Alerte visuelle immédiate en cas de permis de conduire expiré**.

5. **Fiche Client (`/clients/:id`)** :
   - Cartouche d'éligibilité automatique (Âge ≥ 21 ans et validité du permis).
   - Historique complet des locations passées et en cours.

6. **Nouvelle Location - Stepper Wizard (`/locations/new`)** :
   - Assistant guidé en 5 étapes :
     1. Sélection client & vérification d'éligibilité.
     2. Choix des dates de location.
     3. Sélection du véhicule disponible pour la période.
     4. **Simulation financière en direct** avec calcul automatique de la remise fidélité.
     5. Validation et enregistrement.

7. **Suivi des Dossiers de Location (`/locations`)** :
   - Filtrage par statut (`RESERVEE`, `EN_COURS`, `TERMINEE`, `ANNULEE`).
   - Actions directes : Départ (passage du véhicule à LOUÉ), Retour, Annulation.

8. **Restitution du Véhicule (`/locations/:id/retour`)** :
   - Saisie du kilométrage de retour.
   - Calcul automatique des **pénalités de retard (1.5 × tarif journalier par jour de retard)**.
   - Facture et fiche de restitution finale imprimable en un clic.

---

## 2. Prérequis & Installation

- **Node.js** (v18.x, v20.x ou v22.x)
- **npm** (inclus avec Node.js) ou **pnpm**
- **Angular CLI**

### Installation des dépendances :
```bash
cd driveeasy-frontend
npm install
```

---

## 3. Lancement de l'Application

Assurez-vous que l'**API Gateway** backend est active sur le port `8080`.

Lancez le serveur de développement Angular :
```bash
npm start
# ou ng serve
```

L'application est accessible dans votre navigateur à l'adresse :
👉 **[http://localhost:4200](http://localhost:4200)**

---

## 4. Architecture Frontend

```
src/app/
├── core/
│   ├── models/           # Interfaces TypeScript (Vehicule, Client, Location, Stats)
│   └── services/         # Services HTTP Angular (VehiculeService, ClientService, LocationService)
├── features/
│   ├── dashboard/        # Vue KPI et graphiques
│   ├── vehicules/        # Catalogue et formulaire réactif
│   ├── clients/          # Liste et fiche détaillée avec éligibilité
│   └── locations/        # Stepper de réservation, liste et fiche de retour
└── shared/
    └── navbar/           # Barre de navigation globale
```
