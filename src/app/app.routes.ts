import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchFlightsComponent } from './search-flights/search-flights.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'search-flights', loadComponent: () => import('./search-flights/search-flights.component').then(m => m.SearchFlightsComponent) },
    { path: 'booking/:flight_id', loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent) },
    { path: 'payment/:id', loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent) },
    { path: 'payment-success/:id', loadComponent: () => import('./payment-success/payment-success.component').then(m => m.PaymentSuccessComponent) },
    { path: '**', redirectTo: '/home' } // Wildcard route for 404 page
];

