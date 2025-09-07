import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

interface FlightSearch {
  from: string;
  to: string;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
  class: string;
}

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  class: string;
}

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    NavbarComponent
  ],
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.scss'
})
export class SearchFlightsComponent implements OnInit {
  searchForm: FlightSearch = {
    from: '',
    to: '',
    departureDate: null,
    returnDate: null,
    passengers: 1,
    class: 'economy'
  };

  isRoundTrip = false;
  searchResults: FlightResult[] = [];
  isSearching = false;
  showResults = false;

  popularDestinations = [
    'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore',
    'Sydney', 'Rome', 'Barcelona', 'Amsterdam', 'Los Angeles', 'Miami'
  ];

  flightClasses = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {

    // Initialize with today's date
    this.searchForm.departureDate = new Date();
  }

  swapLocations(): void {
    const temp = this.searchForm.from;
    this.searchForm.from = this.searchForm.to;
    this.searchForm.to = temp;
  }

  toggleTripType(): void {
    this.isRoundTrip = !this.isRoundTrip;
    if (!this.isRoundTrip) {
      this.searchForm.returnDate = null;
    }
  }

  selectDestination(destination: string, type: 'from' | 'to'): void {
    if (type === 'from') {
      this.searchForm.from = destination;
    } else {
      this.searchForm.to = destination;
    }
  }

  searchFlights(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSearching = true;
    this.showResults = false;

    // Simulate API call
    setTimeout(() => {
      this.searchResults = this.generateMockResults();
      this.isSearching = false;
      this.showResults = true;
    }, 2000);
  }

  private isFormValid(): boolean {
    return !!(
      this.searchForm.from &&
      this.searchForm.to &&
      this.searchForm.departureDate &&
      (!this.isRoundTrip || this.searchForm.returnDate)
    );
  }

  private generateMockResults(): FlightResult[] {
    const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'Emirates', 'British Airways'];
    const mockResults: FlightResult[] = [];

    for (let i = 0; i < 6; i++) {
      const departureHour = 6 + (i * 2);
      const arrivalHour = departureHour + Math.floor(Math.random() * 8) + 2;

      mockResults.push({
        id: `flight-${i + 1}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        flightNumber: `${Math.floor(Math.random() * 9000) + 1000}`,
        from: this.searchForm.from,
        to: this.searchForm.to,
        departureTime: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        duration: `${Math.floor(Math.random() * 8) + 2}h ${Math.floor(Math.random() * 60)}m`,
        price: Math.floor(Math.random() * 800) + 200,
        stops: Math.floor(Math.random() * 3),
        class: this.searchForm.class
      });
    }

    return mockResults.sort((a, b) => a.price - b.price);
  }

  selectFlight(flight: FlightResult): void {
    console.log('Selected flight:', flight);
    // Here you would typically navigate to booking or store the selection
    alert(`Selected ${flight.airline} ${flight.flightNumber} for $${flight.price}`);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
