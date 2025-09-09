import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html'
})
export class SeatSelectionComponent implements OnInit, OnChanges {
  @Input() totalSeats: number = 60; // default
  @Input() passengerCount: number = 1; // number of passengers to select seats for
  @Output() seatsSelected = new EventEmitter<{ seats: string[], totalPrice: number, seatDetails: any[] }>();

  rows: any[] = [];
  selectedSeats: string[] = [];

  ngOnInit(): void {
    this.generateSeatMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passengerCount'] && !changes['passengerCount'].firstChange) {
      // Reset selected seats when passenger count changes
      this.selectedSeats = [];
      this.emitSeatSelection();
    }
  }

  generateSeatMap() {
    const seatsPerRow = 6;
    const rowsCount = Math.ceil(this.totalSeats / seatsPerRow);

    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    this.rows = Array.from({ length: rowsCount }, (_, rowIndex) => {
      const rowSeats = seatLetters.map((letter, i) => {
        const seatNumber = rowIndex * seatsPerRow + i + 1;
        if (seatNumber > this.totalSeats) return null;

        return {
          label: `${letter}${rowIndex + 1}`,
          price: this.getSeatPrice(seatNumber),
          isExit: this.isExitRow(rowIndex + 1),
          isNonReclining: rowIndex < 2, // first 2 rows non-reclining
        };
      });
      return { rowIndex: rowIndex + 1, seats: rowSeats };
    });
  }

  getSeatPrice(seatNumber: number): number | 'free' {
    if (seatNumber <= 6) return 950; // first row premium
    if (seatNumber <= 12) return 700; // next row
    return 0; // free
  }

  isExitRow(row: number): boolean {
    return row === 10; // just an example
  }

  selectSeat(seat: any) {
    if (!seat || seat.isUnavailable) return;

    const seatIndex = this.selectedSeats.indexOf(seat.label);

    if (seatIndex > -1) {
      // Seat is already selected, deselect it
      this.selectedSeats.splice(seatIndex, 1);
    } else {
      // Seat is not selected
      if (this.selectedSeats.length < this.passengerCount) {
        // Can select more seats
        this.selectedSeats.push(seat.label);
      } else {
        // Already selected maximum number of seats, replace the first one
        this.selectedSeats.shift();
        this.selectedSeats.push(seat.label);
      }
    }

    // Emit the updated seat selection with prices
    this.emitSeatSelection();
  }

  isSeatSelected(seatLabel: string): boolean {
    return this.selectedSeats.includes(seatLabel);
  }

  canSelectMoreSeats(): boolean {
    return this.selectedSeats.length < this.passengerCount;
  }

  private emitSeatSelection(): void {
    const seatDetails = this.getSelectedSeatDetails();
    const totalPrice = seatDetails.reduce((sum, seat) => sum + (seat.price || 0), 0);

    this.seatsSelected.emit({
      seats: [...this.selectedSeats],
      totalPrice: totalPrice,
      seatDetails: seatDetails
    });
  }

  private getSelectedSeatDetails(): any[] {
    const details: any[] = [];

    this.rows.forEach(row => {
      row.seats.forEach((seat: any) => {
        if (seat && this.selectedSeats.includes(seat.label)) {
          details.push({
            label: seat.label,
            price: seat.price,
            isExit: seat.isExit,
            isNonReclining: seat.isNonReclining
          });
        }
      });
    });

    return details;
  }
}
