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
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60', // beach
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60', // mountains
    'https://images.unsplash.com/photo-1511732351157-1865efcb7b7b?auto=format&fit=crop&w=1600&q=60', // city skyline
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=60', // airplane
    'https://images.unsplash.com/photo-1507525428034-1f39a5b50e52?auto=format&fit=crop&w=1600&q=60', // tropical island
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60', // snowy mountains
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=60', // desert dunes
    'https://images.unsplash.com/photo-1526779259212-2c1d6d6bb80a?auto=format&fit=crop&w=1600&q=60', // night cityscape
    'https://images.unsplash.com/photo-1507525428034-1f39a5b50e52?auto=format&fit=crop&w=1600&q=60', // Amalfi Coast
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=60', // Turkey hot air balloons
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60', // Iceland landscapes
    'https://images.unsplash.com/photo-1507525428034-1f39a5b50e52?auto=format&fit=crop&w=1600&q=60', // Surfing in Australia
    'https://images.unsplash.com/photo-1526779259212-2c1d6d6bb80a?auto=format&fit=crop&w=1600&q=60', // Santorini Greece
    'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1600&q=60', // Kyoto Japan
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=60', // Safari Africa
  ];
  
  

  currentSlide = 0;
  private slideInterval: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startCarousel();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      clearInterval(this.slideInterval);
    }
  }

  startCarousel(): void {
    this.slideInterval = setInterval(() => {
      if (this.isBrowser && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.currentSlide = (this.currentSlide + 1) % this.heroImages.length;
      }
    }, 5000);
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
