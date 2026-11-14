import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { VehiculeListComponent } from './features/vehicules/vehicule-list/vehicule-list.component';
import { VehiculeFormComponent } from './features/vehicules/vehicule-form/vehicule-form.component';
import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { ClientDetailComponent } from './features/clients/client-detail/client-detail.component';
import { LocationListComponent } from './features/locations/location-list/location-list.component';
import { LocationNewStepperComponent } from './features/locations/location-new-stepper/location-new-stepper.component';
import { LocationRetourComponent } from './features/locations/location-retour/location-retour.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vehicules', component: VehiculeListComponent },
  { path: 'vehicules/new', component: VehiculeFormComponent },
  { path: 'vehicules/:id/edit', component: VehiculeFormComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: 'locations', component: LocationListComponent },
  { path: 'locations/new', component: LocationNewStepperComponent },
  { path: 'locations/:id/retour', component: LocationRetourComponent },
  { path: '**', redirectTo: 'dashboard' }
];
