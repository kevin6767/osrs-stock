import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ItemPageComponent } from '../components/item-page/item-page.component';

export const routes: Routes = [
  { path: 'items/:itemId', component: ItemPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
