export interface Airport {
    city_name: string;
    country_name: string;
    airport_name: string;
    airport_code: string;
    longitude: number;
    latitude: number;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
}

export class LocationService {
    private static readonly EARTH_RADIUS_KM = 6371;

    /**
     * Get user's current location using geolocation API
     * @returns Promise<UserLocation | null>
     */
    static async getCurrentLocation(): Promise<UserLocation | null> {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.log('Geolocation is not supported by this browser.');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    resolve(null);
                }
            );
        });
    }

    /**
     * Find the nearest airport from user's location
     * @param userLat User's latitude
     * @param userLng User's longitude
     * @param airports Array of available airports
     * @returns Nearest airport city name
     */
    static findNearestAirport(userLat: number, userLng: number, airports: Airport[]): string {
        let nearestAirport = 'New York'; // Default fallback
        let minDistance = Infinity;

        airports.forEach(airport => {
            const distance = this.calculateDistance(
                userLat, userLng,
                airport.latitude, airport.longitude
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestAirport = airport.city_name;
            }
        });

        return nearestAirport;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param lat1 First point latitude
     * @param lng1 First point longitude
     * @param lat2 Second point latitude
     * @param lng2 Second point longitude
     * @returns Distance in kilometers
     */
    static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = this.EARTH_RADIUS_KM * c;

        return distance;
    }

    /**
     * Convert degrees to radians
     * @param deg Degrees
     * @returns Radians
     */
    private static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Get nearest airport with fallback handling
     * @param airports Array of available airports
     * @param fallbackAirport Default airport if geolocation fails
     * @returns Promise<string> Nearest airport city name
     */
    static async getNearestAirportWithFallback(
        airports: Airport[],
        fallbackAirport: string = 'New York'
    ): Promise<string> {
        try {
            const userLocation = await this.getCurrentLocation();

            if (userLocation) {
                console.log('User location:', userLocation.latitude, userLocation.longitude);
                return this.findNearestAirport(
                    userLocation.latitude,
                    userLocation.longitude,
                    airports
                );
            }
        } catch (error) {
            console.log('Error getting nearest airport:', error);
        }

        return fallbackAirport;
    }
}
