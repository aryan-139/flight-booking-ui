import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Passenger {
    id?: number;
    name: string;
    dob: string;
    type: 'adult' | 'child' | 'infant';
    user_id: string;
    email_id?: string;
    country_code?: string;
    phone_number?: string;
    created_at?: string;
}

export interface PassengerResponse {
    success: boolean;
    message: string;
    data: Passenger[];
    timestamp: string;
}

export interface CreatePassengerRequest {
    name: string;
    dob: string;
    type: 'adult' | 'child' | 'infant';
    user_id: string;
    email_id?: string;
    country_code?: string;
    phone_number?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PassengerService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getPassengersByUserId(userId: string): Observable<PassengerResponse> {
        return this.http.get<PassengerResponse>(`${this.baseUrl}/api/passenger/user/${userId}`);
    }

    createPassenger(passenger: CreatePassengerRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/passenger`, passenger);
    }
}
