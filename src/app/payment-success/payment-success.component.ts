import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-payment-success',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
    bookingId: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.bookingId = params['id'];
        });
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }

    // Make window available for template
    public window = window;
}

