import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
    user_id: string;
    flight_id: number;
    booking_type: string;
    passenger_info: number[];
    payment_method: string;
    seat_numbers: { [key: string]: string };
    special_requests: {
        meal: string;
        wheelchair: boolean;
    };
    booking_source: string;
    promocode_used: string;
    total_price: number;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    data: {
        booking_id: number;
        created_at: string;
        user_id: string;
        flight_id: number;
        booking_type: string;
        passenger_info: number[];
        payment_status: string;
        total_price: number;
        payment_date: string | null;
        payment_method: string;
        seat_numbers: { [key: string]: string };
        updated_at: string;
        special_requests: string;
        booking_source: string;
        promocode_used: string;
    };
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    /**
     * Create a new booking
     * @param bookingRequest - The booking request object
     * @returns Observable<BookingResponse>
     */
    createBooking(bookingRequest: BookingRequest): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(`${this.baseUrl}/booking`, bookingRequest);
    }

    /**
     * Get booking details by booking ID
     * @param bookingId - The booking ID
     * @returns Observable<BookingResponse>
     */
    getBookingById(bookingId: number): Observable<BookingResponse> {
        return this.http.get<BookingResponse>(`${this.baseUrl}/booking/${bookingId}`);
    }

    /**
     * Update booking details
     * @param bookingId - The booking ID
     * @param updateData - The data to update
     * @returns Observable<BookingResponse>
     */
    updateBooking(bookingId: number, updateData: Partial<BookingRequest>): Observable<BookingResponse> {
        return this.http.put<BookingResponse>(`${this.baseUrl}/booking/${bookingId}`, updateData);
    }

    /**
     * Cancel a booking
     * @param bookingId - The booking ID
     * @returns Observable<BookingResponse>
     */
    cancelBooking(bookingId: number): Observable<BookingResponse> {
        return this.http.delete<BookingResponse>(`${this.baseUrl}/booking/${bookingId}`);
    }

    /**
     * Get all bookings for a user
     * @param userId - The user ID
     * @returns Observable<BookingResponse[]>
     */
    getUserBookings(userId: string): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.baseUrl}/bookings/user/${userId}`);
    }

    /**
     * Process payment for a booking
     * @param bookingId - The booking ID
     * @param paymentData - Payment information
     * @returns Observable<BookingResponse>
     */
    processPayment(bookingId: number, paymentData: any): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(`${this.baseUrl}/booking/${bookingId}/payment`, paymentData);
    }
}
