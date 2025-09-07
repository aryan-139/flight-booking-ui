import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchFlightsComponent } from './search-flights/search-flights.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'search-flights', loadComponent: () => import('./search-flights/search-flights.component').then(m => m.SearchFlightsComponent) },
    { path: '**', redirectTo: '/home' } // Wildcard route for 404 page
];

