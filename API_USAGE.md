# Flight Booking API Integration

This document explains how to use the Flight Service and Environment configuration in the Flight Booking UI application.

## Environment Configuration

### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  flightApiUrl: 'http://localhost:3000/api/flights',
  bookingApiUrl: 'http://localhost:3000/api/booking',
  authApiUrl: 'http://localhost:3000/api/auth',
  timeout: 30000, // 30 seconds
  retryAttempts: 3
};
```

### Production Environment (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.flightbooking.com/api',
  flightApiUrl: 'https://api.flightbooking.com/api/flights',
  bookingApiUrl: 'https://api.flightbooking.com/api/booking',
  authApiUrl: 'https://api.flightbooking.com/api/auth',
  timeout: 30000, // 30 seconds
  retryAttempts: 3
};
```

## Flight Service Usage

### 1. Search Flights
```typescript
const searchRequest: FlightSearchRequest = {
  origin: 'HYD', // Airport code (e.g., "HYD", "BOM")
  destination: 'BOM', // Airport code (e.g., "DEL", "BLR")
  depart_date: '2025-09-19', // Date in YYYY-MM-DD format
  return_date: '2025-09-22', // Optional for round trip
  adults: 1, // Number of adult passengers
  cabin: 'Economy', // Cabin class (Economy, Premium, Business, First)
  page_size: 100, // Optional: Number of results per page
  page_number: 1 // Optional: Page number
};

this.flightService.searchFlights(searchRequest).subscribe({
  next: (response) => {
    if (response.success) {
      console.log('Flights found:', response.data.flights);
      console.log('Total flights:', response.data.total);
    } else {
      console.error('API Error:', response.message);
    }
  },
  error: (error) => {
    console.error('Search failed:', error);
  }
});
```

### 2. Get Flight Details
```typescript
this.flightService.getFlightDetails('flight-123').subscribe({
  next: (flight) => {
    console.log('Flight details:', flight);
  },
  error: (error) => {
    console.error('Failed to get flight details:', error);
  }
});
```

### 3. Get Popular Destinations
```typescript
this.flightService.getPopularDestinations().subscribe({
  next: (airports) => {
    console.log('Popular destinations:', airports);
  },
  error: (error) => {
    console.error('Failed to load destinations:', error);
  }
});
```

### 4. Search Airports
```typescript
this.flightService.searchAirports('New York').subscribe({
  next: (airports) => {
    console.log('Matching airports:', airports);
  },
  error: (error) => {
    console.error('Airport search failed:', error);
  }
});
```

## API Endpoints

The service expects the following API endpoints to be available:

### Flight Search
- **GET** `/api/flight/search-flights`
- **Parameters**: 
  - `origin` (string): Airport code (e.g., "HYD", "BOM")
  - `destination` (string): Airport code (e.g., "DEL", "BLR")
  - `depart_date` (string): Date in YYYY-MM-DD format
  - `adults` (number): Number of adult passengers
  - `cabin` (string): Cabin class (Economy, Premium, Business, First)
  - `page_size` (number, optional): Number of results per page (default: 100)
  - `page_number` (number, optional): Page number (default: 1)
  - `return_date` (string, optional): Return date for round trip
- **Response**: `FlightSearchResponse`

#### Example API Response:
```json
{
  "success": true,
  "message": "Flights searched successfully",
  "data": {
    "flights": [
      {
        "flight_id": 1453,
        "flight_number": "Air India - 2878",
        "airline": "Air India",
        "origin": "HYD",
        "destination": "BOM",
        "departure_time": "2025-09-19T15:35:00Z",
        "arrival_time": "2025-09-19T17:35:00Z",
        "duration": 120,
        "price": 4035,
        "seats_available": 42,
        "cabin_class": "Economy",
        "total_seats": 42,
        "created_at": "2025-09-08T08:32:20+00:00",
        "updated_at": "2025-09-08T08:32:20+00:00",
        "dynamic_price": null
      }
    ],
    "total": 7,
    "search_params": {
      "origin": "HYD",
      "destination": "BOM",
      "depart_date": "2025-09-19",
      "adults": 1,
      "cabin": "Economy",
      "page_size": 100,
      "page_number": 1
    }
  },
  "timestamp": "2025-09-08T09:41:17.830Z"
}
```

### Flight Details
- **GET** `/api/flights/details/{flightId}`
- **Response**: `FlightResult`

### Popular Destinations
- **GET** `/api/flights/popular-destinations`
- **Response**: `Airport[]`

### Airport Search
- **GET** `/api/flights/airports/search?q={query}`
- **Response**: `Airport[]`

### Flight Prices
- **GET** `/api/flights/prices?from={from}&to={to}&date={date}`
- **Response**: `{ date: string; price: number }[]`

## Error Handling

The service includes comprehensive error handling with:
- HTTP timeout (30 seconds)
- Retry mechanism (3 attempts)
- Detailed error messages for different HTTP status codes
- Fallback to mock data in development

## Building for Different Environments

### Development
```bash
ng serve
# Uses environment.ts (localhost URLs)
```

### Production
```bash
ng build --configuration=production
# Uses environment.prod.ts (production URLs)
```

## Customizing URLs

To change the API URLs:

1. **For Development**: Edit `src/environments/environment.ts`
2. **For Production**: Edit `src/environments/environment.prod.ts`
3. **For Staging**: Create `src/environments/environment.staging.ts` and add it to `angular.json`

Example staging environment:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.flightbooking.com/api',
  flightApiUrl: 'https://staging-api.flightbooking.com/api/flights',
  bookingApiUrl: 'https://staging-api.flightbooking.com/api/booking',
  authApiUrl: 'https://staging-api.flightbooking.com/api/auth',
  timeout: 30000,
  retryAttempts: 3
};
```

## Mock Data Fallback

If the API is unavailable, the application will:
1. Show an error message to the user
2. Fall back to mock data for demonstration
3. Log the error for debugging

This ensures the application remains functional even when the backend is not available.
