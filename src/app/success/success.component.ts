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
  price: string = '';
  ref_number: number = 0;
  payment_time: number = 0;
  id_cart: number = 0;
  payment_method: string = 'Card';
  name: string = 'Carlos Salas';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.paymentService
        .getSuccessSession(params['session_id'])
        .subscribe((session) => {
          this.price = this.formatCurrency(session.total);
          this.ref_number = session.ref_id;
          this.name = session.name;
          this.payment_method = session.payment_method;
          this.payment_time = session.created;
          this.cartService.DeleteAllItems().subscribe((data) => {});
          console.log(session);
        });
    });
  }
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  }
}
