import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightService } from '../services/flight.service';
import { popularDestinations } from '../utils/popular-destinations';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  selectedFlight: any | null = null;
  flight_id: string = '';
  passengers: number = 0;
  class: string = '';
  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
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
  }

  getFlightDetails() {
    this.flightService.getFlightDetails(parseInt(this.flight_id)).subscribe((res: any) => {
      if (res.success) {
        this.selectedFlight = res;
        console.log(this.selectedFlight);
      }
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
}
