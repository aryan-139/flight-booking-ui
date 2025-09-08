import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, timeout, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FlightSearchRequest {
    origin: string; // Airport code (e.g., "HYD", "BOM")
    destination: string; // Airport code (e.g., "DEL", "BLR")
    depart_date: string; // Date in YYYY-MM-DD format
    return_date?: string; // Date in YYYY-MM-DD format (optional for round trip)
    adults: number; // Number of adult passengers
    cabin: string; // Cabin class (Economy, Premium, Business, First)
    page_size?: number; // Number of results per page (default: 100)
    page_number?: number; // Page number (default: 1)
}

export interface FlightResult {
    flight_id: number;
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: string; // ISO 8601 format (e.g., "2025-09-19T15:35:00Z")
    arrival_time: string; // ISO 8601 format (e.g., "2025-09-19T17:35:00Z")
    duration: number; // Duration in minutes
    price: number;
    seats_available: number;
    cabin_class: string;
    total_seats: number;
    created_at: string;
    updated_at: string;
    dynamic_price?: number | null;
}

export interface FlightSearchResponse {
    success: boolean;
    message: string;
    data: {
        flights: FlightResult[];
        total: number;
        search_params: {
            origin: string;
            destination: string;
            depart_date: string;
            adults: number;
            cabin: string;
            page_size: number;
            page_number: number;
        };
    };
    timestamp: string;
}

export interface Airport {
    city_name: string;
    country_name: string;
    airport_name: string;
    airport_code: string;
    longitude: number;
    latitude: number;
}

@Injectable({
    providedIn: 'root'
})
export class FlightService {
    private readonly apiUrl = environment.flightApiUrl;
    private readonly timeout = environment.timeout;
    private readonly retryAttempts = environment.retryAttempts;

    constructor(private http: HttpClient) { }

    /**
     * Search for flights based on search criteria
     */
    searchFlights(searchRequest: FlightSearchRequest): Observable<FlightSearchResponse> {
        const params = new HttpParams()
            .set('origin', searchRequest.origin)
            .set('destination', searchRequest.destination)
            .set('depart_date', searchRequest.depart_date)
            .set('adults', searchRequest.adults.toString())
            .set('cabin', searchRequest.cabin)
            .set('page_size', (searchRequest.page_size || 100).toString())
            .set('page_number', (searchRequest.page_number || 1).toString());

        // Add return_date if provided (for round trip)
        if (searchRequest.return_date) {
            params.set('return_date', searchRequest.return_date);
        }

        console.log('API Request:', `${this.apiUrl}/search-flights`, params);
        return this.http.get<FlightSearchResponse>(`${this.apiUrl}/search-flights`, { params })
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Get flight details by ID
     */
    getFlightDetails(flightId: number): Observable<FlightResult> {
        return this.http.get<FlightResult>(`${this.apiUrl}/get-flight-by-id/${flightId}`)
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Get available airports/cities
     */
    getAirports(): Observable<Airport[]> {
        return this.http.get<Airport[]>(`${this.apiUrl}/airports`)
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Search airports by query
     */
    searchAirports(query: string): Observable<Airport[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<Airport[]>(`${this.apiUrl}/airports/search`, { params })
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Get popular destinations
     */
    getPopularDestinations(): Observable<Airport[]> {
        return this.http.get<Airport[]>(`${this.apiUrl}/popular-destinations`)
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Get flight prices for specific dates
     */
    getFlightPrices(from: string, to: string, date: string): Observable<{ date: string; price: number }[]> {
        const params = new HttpParams()
            .set('from', from)
            .set('to', to)
            .set('date', date);

        return this.http.get<{ date: string; price: number }[]>(`${this.apiUrl}/prices`, { params })
            .pipe(
                timeout(this.timeout),
                retry(this.retryAttempts),
                catchError(this.handleError)
            );
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            switch (error.status) {
                case 400:
                    errorMessage = 'Invalid request parameters. Please check your search criteria.';
                    break;
                case 401:
                    errorMessage = 'Unauthorized access. Please check your credentials.';
                    break;
                case 403:
                    errorMessage = 'Access forbidden. You do not have permission to access this resource.';
                    break;
                case 404:
                    errorMessage = 'No flights found for your search criteria.';
                    break;
                case 429:
                    errorMessage = 'Too many requests. Please try again later.';
                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later.';
                    break;
                case 503:
                    errorMessage = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
        }

        console.error('Flight Service Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
