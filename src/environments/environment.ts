export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    flightApiUrl: 'http://localhost:3000/api/flight',
    //apiUrl: 'https://flight-booking-engine.vercel.app',
    //flightApiUrl: 'https://flight-booking-engine.vercel.app/api/flight',
    //bookingApiUrl: 'https://flight-booking-engine.vercel.app/api/booking',
    bookingApiUrl: 'http://localhost:3000/api/booking',
    //authApiUrl: 'http://localhost:3000/api/auth',
    timeout: 30000, // 30 seconds
    retryAttempts: 3
};
