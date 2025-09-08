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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { LocationService, Airport } from '../utils/location';
import { FlightService, FlightSearchRequest, FlightResult } from '../services/flight.service';
import { popularDestinations } from '../utils/popular-destinations';


interface FlightSearch {
  from: string; // Airport code (e.g., "HYD", "BOM")
  to: string; // Airport code (e.g., "DEL", "BLR")
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
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
    MatAutocompleteModule,
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
    class: 'Economy'
  };

  // Display values for the UI (city names)
  fromDisplay: string = '';
  toDisplay: string = '';

  isRoundTrip = false; // Default to one way
  searchResults: FlightResult[] = [];
  isSearching = false;
  showResults = false;

  popularDestinations = popularDestinations;

  filteredFromCities: Airport[] = [];
  filteredToCities: Airport[] = [];

  // Custom dropdown state
  showPassengerDropdown = false;

  flightClasses = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Premium', label: 'Premium Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First Class' }
  ];

  constructor(
    private router: Router,
    private flightService: FlightService
  ) { }

  async ngOnInit(): Promise<void> {
    this.searchForm.departureDate = new Date();

    // Load airports from API
    this.loadAirports();

    // Populate nearest airport based on geolocation
    const nearestAirport = await LocationService.getNearestAirportWithFallback(
      this.popularDestinations,
      'New York'
    );
    this.fromDisplay = nearestAirport;
    // Find the airport code for the nearest airport
    const airport = this.popularDestinations.find(a => a.city_name === nearestAirport);
    this.searchForm.from = airport ? airport.airport_code : 'JFK';

    // Default to one way trip
    this.isRoundTrip = false;
    this.filteredFromCities = [...this.popularDestinations];
    this.filteredToCities = [...this.popularDestinations];
  }

  private loadAirports(): void {
    this.popularDestinations = this.popularDestinations;
    // this.flightService.getPopularDestinations().subscribe({
    //   next: (airports) => {
    //     this.popularDestinations = airports;
    //     this.filteredFromCities = [...this.popularDestinations];
    //     this.filteredToCities = [...this.popularDestinations];
    //     console.log('Airports loaded successfully:', airports);
    //   },
    //   error: (error) => {
    //     console.error('Failed to load airports:', error);
    //     // Keep using the hardcoded airports as fallback
    //     console.log('Using fallback airports');
    //   }
    // });
  }


  swapLocations() {
    const tempCode = this.searchForm.from;
    const tempDisplay = this.fromDisplay;

    this.searchForm.from = this.searchForm.to;
    this.fromDisplay = this.toDisplay;

    this.searchForm.to = tempCode;
    this.toDisplay = tempDisplay;
  }

  // Automatically determine trip type based on date selection
  updateTripType(): void {
    this.isRoundTrip = !!(this.searchForm.returnDate);
  }

  // Clear return date and make it one way
  clearReturnDate(): void {
    this.searchForm.returnDate = null;
    this.updateTripType();
  }

  filterFromCities(): void {
    this.filteredFromCities = this.popularDestinations.filter(airport =>
      airport.city_name.toLowerCase().includes(this.fromDisplay.toLowerCase())
    );
  }

  filterToCities(): void {
    this.filteredToCities = this.popularDestinations.filter(airport =>
      airport.city_name.toLowerCase().includes(this.toDisplay.toLowerCase())
    );
  }

  // Custom passenger dropdown methods
  togglePassengerDropdown(): void {
    this.showPassengerDropdown = !this.showPassengerDropdown;
  }

  closePassengerDropdown(): void {
    this.showPassengerDropdown = false;
  }

  updatePassengerCount(count: number): void {
    this.searchForm.passengers = count;
  }

  onPassengerSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    this.updatePassengerCount(value);
  }

  selectDestination(airport: Airport, type: 'from' | 'to'): void {
    if (type === 'from') {
      this.searchForm.from = airport.airport_code;
      this.fromDisplay = airport.city_name;
    } else {
      this.searchForm.to = airport.airport_code;
      this.toDisplay = airport.city_name;
    }
  }

  searchFlights(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSearching = true;
    this.showResults = false;

    // Prepare search request
    const searchRequest: FlightSearchRequest = {
      origin: this.searchForm.from,
      destination: this.searchForm.to,
      depart_date: this.searchForm.departureDate!.toISOString().split('T')[0],
      return_date: this.searchForm.returnDate ? this.searchForm.returnDate.toISOString().split('T')[0] : undefined,
      adults: this.searchForm.passengers,
      cabin: this.searchForm.class,
      page_size: 100,
      page_number: 1
    };
    console.log('Search Request:', searchRequest);

    // Make API call
    this.flightService.searchFlights(searchRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.searchResults = response.data.flights;
          this.isSearching = false;
          this.showResults = true;
          console.log('Flight search successful:', response);
        } else {
          console.error('API returned error:', response.message);
          this.isSearching = false;
          this.searchResults = this.generateMockResults();
          this.showResults = true;
          alert(`API Error: ${response.message}. Showing mock results for demonstration.`);
        }
      },
      error: (error) => {
        console.error('Flight search failed:', error);
        this.isSearching = false;
        // Fallback to mock results for development
        this.searchResults = this.generateMockResults();
        this.showResults = true;
        alert('API call failed. Showing mock results for demonstration.');
      }
    });
  }

  private isFormValid(): boolean {
    // Update trip type based on current date selection
    this.updateTripType();

    return !!(
      this.searchForm.from &&
      this.searchForm.to &&
      this.searchForm.departureDate &&
      (!this.isRoundTrip || this.searchForm.returnDate)
    );
  }

  private generateMockResults(): FlightResult[] {
    const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia'];
    const mockResults: FlightResult[] = [];

    for (let i = 0; i < 6; i++) {
      const departureHour = 6 + (i * 2);
      const arrivalHour = departureHour + Math.floor(Math.random() * 8) + 2;
      const departureDate = this.searchForm.departureDate!.toISOString().split('T')[0];
      const arrivalDate = this.searchForm.returnDate ? this.searchForm.returnDate.toISOString().split('T')[0] : departureDate;

      // Create ISO 8601 formatted times
      const departureTime = `${departureDate}T${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`;
      const arrivalTime = `${arrivalDate}T${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`;

      // Calculate duration in minutes
      const durationMinutes = (arrivalHour - departureHour) * 60 + Math.floor(Math.random() * 60);

      mockResults.push({
        flight_id: 1000 + i,
        flight_number: `${airlines[Math.floor(Math.random() * airlines.length)]} - ${Math.floor(Math.random() * 9000) + 1000}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        origin: this.searchForm.from,
        destination: this.searchForm.to,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        duration: durationMinutes,
        price: Math.floor(Math.random() * 5000) + 2000,
        seats_available: Math.floor(Math.random() * 50) + 10,
        cabin_class: this.searchForm.class,
        total_seats: Math.floor(Math.random() * 50) + 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        dynamic_price: null
      });
    }

    return mockResults.sort((a, b) => a.price - b.price);
  }

  selectFlight(flight: FlightResult): void {
    console.log('Selected flight:', flight);
    // Navigate to booking page with flight data
    this.router.navigate(['/booking', flight.flight_id], {
      state: { selectedFlight: flight },
      queryParams: {
        passengers: this.searchForm.passengers,
        class: this.searchForm.class
      }
    });

  }

  // Helper method to format duration from minutes to hours and minutes
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  // Helper method to format time from ISO string to HH:MM format
  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }


}
