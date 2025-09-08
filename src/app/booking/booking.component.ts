import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightResult } from '../services/flight.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  selectedFlight: FlightResult | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get flight data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['selectedFlight']) {
      this.selectedFlight = navigation.extras.state['selectedFlight'];
      console.log('Received flight data:', this.selectedFlight);
    }
  }

  goBack(): void {
    this.router.navigate(['/search-flights']);
  }
}
