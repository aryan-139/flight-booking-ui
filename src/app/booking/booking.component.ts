import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightService } from '../services/flight.service';
import { PassengerService, Passenger, CreatePassengerRequest } from '../services/passenger.service';
import { popularDestinations } from '../utils/popular-destinations';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  selectedFlight: any | null = null;
  flight_id: string = '';
  passengers: number = 0;
  class: string = '';
  isLoading: boolean = true;
  userId: string = "dummy";

  // Passenger related properties
  existingPassengers: Passenger[] = [];
  selectedPassengers: Passenger[] = [];
  showAddPassengerForm: boolean = false;
  newPassenger: CreatePassengerRequest = {
    name: '',
    dob: '',
    type: 'adult',
    user_id: 'dummy',
    email_id: '',
    country_code: '+91',
    phone_number: ''
  };
  isLoadingPassengers: boolean = false;
  isPassengerPanelExpanded: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private passengerService: PassengerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.flight_id = params['flight_id'];
      this.getFlightDetails();
    });
    this.route.queryParams.subscribe(params => {
      this.passengers = params['passengers'];
      this.class = params['class'];
    });

    // Automatically load existing passengers
    this.loadExistingPassengers();
  }

  getFlightDetails() {
    this.isLoading = true;
    this.flightService.getFlightDetails(parseInt(this.flight_id)).subscribe((res: any) => {
      if (res.success) {
        this.selectedFlight = res;
        console.log(this.selectedFlight);
      }
      // Simulate loading time for better UX
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    }, (error) => {
      console.error('Error fetching flight details:', error);
      this.isLoading = false;
    });
  }

  getTotalFare(): number {
    return 6900 + 1362; // static for now, can come from API later
  }

  getCityNameFromCode(code: string): string {
    return popularDestinations.find(airport => airport.airport_code === code)?.city_name || '';
  }
  getAirportNameFromCode(code: string): string {
    return popularDestinations.find(airport => airport.airport_code === code)?.airport_name || '';
  }
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  calculateSurcharges(price: number): number {
    return price * 0.2;
  }

  // Passenger related methods
  loadExistingPassengers(): void {
    this.isLoadingPassengers = true;
    this.passengerService.getPassengersByUserId(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.existingPassengers = response.data;
        }
        this.isLoadingPassengers = false;
      },
      error: (error) => {
        console.error('Error loading passengers:', error);
        this.isLoadingPassengers = false;
      }
    });
  }

  togglePassengerSelection(passenger: Passenger): void {
    const index = this.selectedPassengers.findIndex(p => p.id === passenger.id);
    if (index > -1) {
      this.selectedPassengers.splice(index, 1);
    } else {
      this.selectedPassengers.push(passenger);
    }
  }

  isPassengerSelected(passenger: Passenger): boolean {
    return this.selectedPassengers.some(p => p.id === passenger.id);
  }

  showAddPassenger(): void {
    this.showAddPassengerForm = true;
  }

  addNewPassenger(): void {
    if (this.newPassenger.name && this.newPassenger.dob) {
      this.passengerService.createPassenger(this.newPassenger).subscribe({
        next: (response) => {
          console.log('Passenger created:', response);
          this.loadExistingPassengers(); // Reload the list
          this.resetNewPassengerForm();
        },
        error: (error) => {
          console.error('Error creating passenger:', error);
        }
      });
    }
  }

  resetNewPassengerForm(): void {
    this.newPassenger = {
      name: '',
      dob: '',
      type: 'adult',
      user_id: this.userId,
      email_id: '',
      country_code: '+91',
      phone_number: ''
    };
    this.showAddPassengerForm = false;
  }

  getPassengerTypeColor(type: string): string {
    switch (type) {
      case 'adult': return 'bg-blue-100 text-blue-800';
      case 'child': return 'bg-green-100 text-green-800';
      case 'infant': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  togglePassengerPanel(): void {
    this.isPassengerPanelExpanded = !this.isPassengerPanelExpanded;
  }
}
