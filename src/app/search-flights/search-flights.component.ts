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
    class: 'economy'
  };

  isRoundTrip = false; // Default to one way
  searchResults: FlightResult[] = [];
  isSearching = false;
  showResults = false;

  popularDestinations: Airport[] = [{
    "city_name": "Paris",
    "country_name": "France",
    "airport_name": "Paris Charles de Gaulle Airport",
    "airport_code": "CDG",
    "longitude": 2.55,
    "latitude": 49.01
  },
  {
    "city_name": "London",
    "country_name": "United Kingdom",
    "airport_name": "London Heathrow Airport",
    "airport_code": "LHR",
    "longitude": -0.46,
    "latitude": 51.47
  },
  {
    "city_name": "New York",
    "country_name": "United States",
    "airport_name": "New York John F. Kennedy International Airport",
    "airport_code": "JFK",
    "longitude": -73.78,
    "latitude": 40.64
  },
  {
    "city_name": "Tokyo",
    "country_name": "Japan",
    "airport_name": "Tokyo Narita Airport",
    "airport_code": "NRT",
    "longitude": 139.78,
    "latitude": 35.76
  },
  {
    "city_name": "Dubai",
    "country_name": "United Arab Emirates",
    "airport_name": "Dubai International Airport",
    "airport_code": "DXB",
    "longitude": 55.36,
    "latitude": 25.27
  },
  {
    "city_name": "Bangkok",
    "country_name": "Thailand",
    "airport_name": "Bangkok Suvarnabhumi Airport",
    "airport_code": "BKK",
    "longitude": 100.78,
    "latitude": 13.95
  },
  {
    "city_name": "Sydney",
    "country_name": "Australia",
    "airport_name": "Sydney International Airport",
    "airport_code": "SYD",
    "longitude": 151.18,
    "latitude": -33.94
  },
  {
    "city_name": "Rome",
    "country_name": "Italy",
    "airport_name": "Rome Fiumicino Airport",
    "airport_code": "FCO",
    "longitude": 12.25,
    "latitude": 41.80
  },
  {
    "city_name": "Barcelona",
    "country_name": "Spain",
    "airport_name": "Barcelona Airport",
    "airport_code": "BCN",
    "longitude": 2.16,
    "latitude": 41.29
  },
  {
    "city_name": "Istanbul",
    "country_name": "Turkey",
    "airport_name": "Istanbul Airport",
    "airport_code": "IST",
    "longitude": 28.81,
    "latitude": 40.89
  },
  {
    "city_name": "Bangalore",
    "country_name": "India",
    "airport_name": "Bangalore International Airport",
    "airport_code": "BLR",
    "longitude": 77.60,
    "latitude": 12.97
  },
  {
    "city_name": "New Delhi",
    "country_name": "India",
    "airport_name": "Indira Gandhi International Airport",
    "airport_code": "DEL",
    "longitude": 77.103088,
    "latitude": 28.5665
  },
  {
    "city_name": "Handia (Hardoi)",
    "country_name": "India",
    "airport_name": "Handia Airport",
    "airport_code": "HDO",
    "longitude": 75.1622,
    "latitude": 17.0494
  },
  {
    "city_name": "Indore",
    "country_name": "India",
    "airport_name": "Devi Ahilya Bai Holkar Airport",
    "airport_code": "IDR",
    "longitude": 75.8011,
    "latitude": 22.7218
  },
  {
    "city_name": "Mumbai",
    "country_name": "India",
    "airport_name": "Chhatrapati Shivaji Maharaj International Airport",
    "airport_code": "BOM",
    "longitude": 72.865,
    "latitude": 19.0896
  },
  {
    "city_name": "Bengaluru",
    "country_name": "India",
    "airport_name": "Kempegowda International Airport",
    "airport_code": "BLR",
    "longitude": 77.7063,
    "latitude": 13.1979
  },
  {
    "city_name": "Hyderabad",
    "country_name": "India",
    "airport_name": "Rajiv Gandhi International Airport",
    "airport_code": "HYD",
    "longitude": 78.4294,
    "latitude": 17.2403
  },
  {
    "city_name": "Kolkata",
    "country_name": "India",
    "airport_name": "Netaji Subhas Chandra Bose International Airport",
    "airport_code": "CCU",
    "longitude": 88.445,
    "latitude": 22.6547
  },
  {
    "city_name": "Chennai",
    "country_name": "India",
    "airport_name": "Chennai International Airport",
    "airport_code": "MAA",
    "longitude": 80.1693,
    "latitude": 12.9944
  },
  {
    "city_name": "Patna",
    "country_name": "India",
    "airport_name": "Jay Prakash Narayan International Airport",
    "airport_code": "PAT",
    "longitude": 85.088,
    "latitude": 25.5913
  },
  {
    "city_name": "Deoghar",
    "country_name": "India",
    "airport_name": "Deoghar Airport",
    "airport_code": "DGH",
    "longitude": 86.6997,
    "latitude": 24.4763
  },
  {
    "city_name": "Pune",
    "country_name": "India",
    "airport_name": "Pune International Airport",
    "airport_code": "PNQ",
    "longitude": 73.9197,
    "latitude": 18.5821
  },
  {
    "city_name": "Goa",
    "country_name": "India",
    "airport_name": "Goa International Airport (Dabolim)",
    "airport_code": "GOI",
    "longitude": 73.8314,
    "latitude": 15.3808
  },
  {
    "city_name": "Guwahati",
    "country_name": "India",
    "airport_name": "Lokpriya Gopinath Bordoloi International Airport",
    "airport_code": "GAU",
    "longitude": 91.5889,
    "latitude": 26.1061
  },
  {
    "city_name": "Bhubaneswar",
    "country_name": "India",
    "airport_name": "Biju Patnaik International Airport",
    "airport_code": "BBI",
    "longitude": 85.8189,
    "latitude": 20.2444
  },
  {
    "city_name": "Bagdogra",
    "country_name": "India",
    "airport_name": "Bagdogra International Airport",
    "airport_code": "IXB",
    "longitude": 88.3286,
    "latitude": 26.6812
  },
  {
    "city_name": "Port Blair",
    "country_name": "India",
    "airport_name": "Veer Savarkar International Airport",
    "airport_code": "IXZ",
    "longitude": 92.7297,
    "latitude": 11.6412
  },
  {
    "city_name": "Lucknow",
    "country_name": "India",
    "airport_name": "Chaudhary Charan Singh International Airport",
    "airport_code": "LKO",
    "longitude": 80.8893,
    "latitude": 26.7606
  },
  {
    "city_name": "Jaipur",
    "country_name": "India",
    "airport_name": "Jaipur International Airport",
    "airport_code": "JAI",
    "longitude": 75.8122,
    "latitude": 26.8242
  },
  {
    "city_name": "Agartala",
    "country_name": "India",
    "airport_name": "Maharaja Bir Bikram Airport",
    "airport_code": "IXA",
    "longitude": 91.2404,
    "latitude": 23.886
  }
  ];

  filteredFromCities: Airport[] = [];
  filteredToCities: Airport[] = [];

  // Custom dropdown state
  showPassengerDropdown = false;

  flightClasses = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ];

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.searchForm.departureDate = new Date();

    // Populate nearest airport based on geolocation
    this.searchForm.from = await LocationService.getNearestAirportWithFallback(
      this.popularDestinations,
      'New York'
    );

    // Default to one way trip
    this.isRoundTrip = false;
    this.filteredFromCities = [...this.popularDestinations];
    this.filteredToCities = [...this.popularDestinations];
  }


  swapLocations() {
    const temp = this.searchForm.from;
    this.searchForm.from = this.searchForm.to;
    this.searchForm.to = temp;
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
      airport.city_name.toLowerCase().includes(this.searchForm.from.toLowerCase())
    );
  }

  filterToCities(): void {
    this.filteredToCities = this.popularDestinations.filter(airport =>
      airport.city_name.toLowerCase().includes(this.searchForm.to.toLowerCase())
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
    alert(`Selected ${flight.airline} ${flight.flightNumber} for $${flight.price}, ${flight.class}`);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


}
