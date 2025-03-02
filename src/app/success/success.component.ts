import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../Services/PaymentService';
import { CartService } from '../Services/CartsService';

@Component({
  selector: 'app-success',
  imports: [MatDividerModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent implements OnInit {
  price: string = ''; // Total payment amount
  ref_number: string = ''; // Reference number for the payment
  payment_time: number = 0; // Payment time
  id_cart: number = 0; // Cart ID
  payment_method: string = 'Card'; // Payment method used
  name: string = 'Carlos Salas'; // Name of the user

  constructor(
    private route: ActivatedRoute, // ActivatedRoute to access route parameters
    private paymentService: PaymentService, // PaymentService to handle payment sessions
    private cartService: CartService // CartService to manage cart items
  ) {}

  ngOnInit(): void {
    // Subscribe to query parameters to get the session ID
    this.route.queryParams.subscribe((params) => {
      this.paymentService
        .getSuccessSession(params['session_id']) // Fetch payment session details using session ID
        .subscribe((session) => {
          this.price = this.formatCurrency(session.total); // Format and set the total payment amount
          this.ref_number = session.ref_id; // Set the reference number
          this.name = session.name; // Set the user's name
          this.payment_method = session.payment_method; // Set the payment method
          this.payment_time = session.created; // Set the payment time
          this.cartService.DeleteAllItems().subscribe((data) => {}); // Delete all items from the cart
          console.log(session); // Log the session details for debugging
        });
    });
  }

  // Function to format the currency amount
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert cents to dollars and format as currency
  }
}
