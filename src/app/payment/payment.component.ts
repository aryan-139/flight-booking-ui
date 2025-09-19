import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { BookingService, BookingResponse } from '../services/booking.service';

interface PaymentForm {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    paymentMethod: string;
}

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, NavbarComponent, FormsModule],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    isLoading: boolean = true;
    isProcessingPayment: boolean = false;
    bookingData: BookingResponse | null = null;
    error: string | null = null;
    bookingId: string = '';

    // Payment form data
    paymentForm: PaymentForm = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        paymentMethod: 'card'
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.bookingId = params['id'];
            this.loadBookingData();
        });
    }

    loadBookingData(): void {
        this.isLoading = true;
        this.error = null;

        this.bookingService.getBookingById(parseInt(this.bookingId))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.bookingData = response;
                        this.isLoading = false;
                        console.log('Booking data loaded:', response);
                    } else {
                        this.error = 'Failed to load booking data';
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    console.error('Error loading booking data:', error);
                    this.error = 'Failed to load booking data. Please try again.';
                    this.isLoading = false;
                }
            });
    }

    formatCardNumber(value: string): string {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    onCardNumberInput(event: any): void {
        const formatted = this.formatCardNumber(event.target.value);
        this.paymentForm.cardNumber = formatted;
        event.target.value = formatted;
    }

    formatExpiryDate(value: string): string {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add slash after 2 digits
        if (digits.length >= 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4);
        }
        return digits;
    }

    onExpiryDateInput(event: any): void {
        const formatted = this.formatExpiryDate(event.target.value);
        this.paymentForm.expiryDate = formatted;
        event.target.value = formatted;
    }

    isFormValid(): boolean {
        return this.paymentForm.cardNumber.replace(/\s/g, '').length === 16 &&
            this.paymentForm.expiryDate.length === 5 &&
            this.paymentForm.cvv.length === 3 &&
            this.paymentForm.cardholderName.trim().length > 0;
    }

    processPayment(): void {
        if (!this.isFormValid() || !this.bookingData) {
            return;
        }

        this.isProcessingPayment = true;

        const paymentData = {
            booking_id: this.bookingData.data.booking_id,
            payment_method: this.paymentForm.paymentMethod,
            amount: this.bookingData.data.total_price,
            card_number: this.paymentForm.cardNumber.replace(/\s/g, ''),
            expiry_date: this.paymentForm.expiryDate,
            cvv: this.paymentForm.cvv,
            cardholder_name: this.paymentForm.cardholderName
        };

        // Simulate payment processing
        setTimeout(() => {
            this.isProcessingPayment = false;
            // Navigate to success page or show success message
            if (this.bookingData)
                this.router.navigate(['/payment-success', this.bookingData.data.booking_id]);
            else
                this.router.navigate(['/payment-success', this.bookingId]);
        }, 3000);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getTotalAmount(): number {
        return this.bookingData?.data?.total_price || 0;
    }

    // Helper method to parse JSON
    parseJSON(jsonString: string): any {
        return JSON.parse(jsonString);
    }
}

