import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightService } from '../services/flight.service';
import { PassengerService, Passenger, CreatePassengerRequest } from '../services/passenger.service';
import { BookingService, BookingRequest } from '../services/booking.service';
import { popularDestinations } from '../utils/popular-destinations';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, SeatSelectionComponent],
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
  totalSeats: number = 0;

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
    private router: Router,
    private bookingService: BookingService,
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
        this.totalSeats = this.selectedFlight.data.total_seats;
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

  selectedSeats: string[] = [];
  selectedSeatDetails: any[] = [];
  seatSelectionTotal: number = 0;

  // Booking related properties
  isBookingInProgress: boolean = false;
  bookingSuccess: boolean = false;
  bookingError: string | null = null;
  bookingResponse: any = null;

  onSeatsSelected(seatData: { seats: string[], totalPrice: number, seatDetails: any[] }): void {
    this.selectedSeats = seatData.seats;
    this.selectedSeatDetails = seatData.seatDetails;
    this.seatSelectionTotal = seatData.totalPrice;
    console.log('Selected seats:', seatData);
  }

  getTotalAmount(): number {
    if (!this.selectedFlight?.data) return 0;

    const baseFare = this.selectedFlight.data.price || 6900;
    const dynamicPrice = this.selectedFlight.data.dynamic_price || 0;
    const surcharges = this.calculateSurcharges(baseFare + dynamicPrice);
    const seatCost = this.seatSelectionTotal || 0;

    return baseFare + dynamicPrice + surcharges + seatCost;
  }

  confirmBooking(): void {
    // Validate that passengers and seats are selected
    if (this.selectedPassengers.length === 0) {
      alert('Please select passengers before confirming booking.');
      return;
    }

    if (this.selectedSeats.length === 0) {
      alert('Please select seats before confirming booking.');
      return;
    }

    this.isBookingInProgress = true;
    this.bookingError = null;
    this.bookingSuccess = false;

    // Prepare the booking request object
    const bookingRequest: BookingRequest = {
      user_id: this.userId,
      flight_id: parseInt(this.flight_id),
      booking_type: "one-way",
      passenger_info: this.selectedPassengers.map(p => p.id).filter(id => id !== undefined) as number[], // Use selected passenger IDs
      payment_method: "card",
      seat_numbers: this.buildSeatNumbersObject(),
      special_requests: {
        meal: "vegetarian", // This could be made dynamic based on user selection
        wheelchair: false   // This could be made dynamic based on user selection
      },
      total_price: this.getTotalAmount(),
      booking_source: "web",
      promocode_used: "SAVE10" // This could be made dynamic based on user input
    };

    console.log('Creating booking with request:', bookingRequest);

    // Use the booking service to create the booking
    this.bookingService.createBooking(bookingRequest)
      .subscribe({
        next: (response) => {
          console.log('Booking created successfully:', response);
          this.bookingResponse = response;
          this.bookingSuccess = true;
          this.isBookingInProgress = false;

          // Navigate to payment page on successful booking
          if (response.success) {
            this.router.navigate(['/payment', response.data?.booking_id]);
          }
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.bookingError = error.error?.message || 'Failed to create booking. Please try again.';
          this.isBookingInProgress = false;
          alert(`Booking failed: ${this.bookingError}`);
        }
      });
  }

  // Helper method to build seat numbers object
  private buildSeatNumbersObject(): { [key: string]: string } {
    const seatNumbers: { [key: string]: string } = {};
    this.selectedSeats.forEach((seat, index) => {
      seatNumbers[(index + 1).toString()] = seat;
    });
    return seatNumbers;
  }
}
