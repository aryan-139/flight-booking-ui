import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SkyBook - Flight Booking';

  heroImages: string[] = [
    'assets/carousel/amalfi-2254776_1920.jpg', // Amalfi Coast
    'assets/carousel/cruise-ship-363804_1920.jpg', // Cruise Ship
    'assets/carousel/hot-air-balloons-6757939_1920.jpg', // Hot Air Balloons
    'assets/carousel/italy-9505450_1920.jpg', // Italy
    'assets/carousel/night-4694750_1920.jpg', // Night Cityscape
    'assets/carousel/street-4942809_1920.jpg', // Street Scene
    'assets/carousel/sunset-3875817_1920.jpg', // Sunset
    'assets/carousel/venice-1718664_1920.jpg', // Venice
  ];

  popularCities: string[] = [
    'Paris', 'Tokyo', 'New York', 'London', 'Dubai',
    'Rome', 'Barcelona', 'Amsterdam', 'Sydney', 'Singapore'
  ];

  currentSlide = 0;
  currentCity = 'Paris';
  private slideInterval: any;
  private cityInterval: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startCarousel();
      this.startCityRotation();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      clearInterval(this.slideInterval);
      clearInterval(this.cityInterval);
    }
  }

  startCarousel(): void {
    this.slideInterval = setInterval(() => {
      if (this.isBrowser && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.currentSlide = (this.currentSlide + 1) % this.heroImages.length;
      }
    }, 5000);
  }

  startCityRotation(): void {
    let cityIndex = 0;
    this.cityInterval = setInterval(() => {
      if (this.isBrowser && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        cityIndex = (cityIndex + 1) % this.popularCities.length;
        this.currentCity = this.popularCities[cityIndex];
      }
    }, 3000); // Change city every 3 seconds
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onImageLoad(event: Event): void {
    if (this.isBrowser) {
      const img = event.target as HTMLImageElement;
      img.setAttribute('data-loaded', 'true');
    }
  }
}
