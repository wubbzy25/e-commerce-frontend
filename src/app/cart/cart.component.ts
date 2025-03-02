import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { CartService } from '../Services/CartsService';
import { catchError, switchMap, of } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { PaymentService } from '../Services/PaymentService';
import { ToastrService } from 'ngx-toastr';
import { CartItems } from '../../interfaces/CartItems';
import { Cart } from '../../interfaces/Cart';

@Component({
  selector: 'app-cart',
  imports: [NavbarComponent, FooterComponent, CommonModule, MatDividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: CartItems[] = []; // List of cart items
  id_cart: number = 0; // ID of the cart
  subtotal = signal(0); // Signal for cart subtotal
  discount = signal(0); // Signal for cart discount
  delivery: number = 15; // Fixed delivery cost
  total = signal(0); // Signal for cart total
  id_user: String = ''; // User ID
  productAmounts: number[] = []; // List of product quantities
  private localStorage: Storage | undefined; // Local storage reference

  constructor(
    private cartServices: CartService,
    private router: Router,
    private paymentServices: PaymentService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  ngOnInit(): void {
    // Fetch or create cart when the component initializes
    this.cartServices
      .GetCart()
      .pipe(
        catchError(() => {
          return this.cartServices.CreateCart(); // Create a new cart if there's an error fetching the existing one
        }),
        switchMap((response) => {
          if (!response) {
            return this.cartServices.CreateCart(); // Create a new cart if no response
          }
          return of(response as Cart); // Return the response as a cart
        })
      )
      .subscribe((response) => {
        if (isCart(response)) {
          this.cartServices
            .GetCartItems(response.id_cart)
            .subscribe((items) => {
              this.cartItems = items; // Assign cart items
              this.id_cart = response.id_cart; // Assign cart ID
              this.productAmounts = items.map(
                (item: CartItems) => item.quantity
              );
              this.CalculateSubtotal(); // Calculate the subtotal
              this.CalculateDiscount(); // Calculate the discount
              this.CalculateTotal(); // Calculate the total
            });
        }
      });
  }

  AddAmountProduct(index: number, id_item: number): void {
    // Increase the quantity of a product in the cart
    if (this.productAmounts[index] < this.cartItems[index].product.stock) {
      let oldAmount = this.productAmounts[index];
      this.productAmounts[index]++;

      if (this.productAmounts[index] != oldAmount) {
        this.cartServices
          .UpdateQuantity(this.productAmounts[index], id_item)
          .subscribe((data) => {
            this.cartItems[index].quantity = this.productAmounts[index];
            this.CalculateSubtotal(); // Recalculate the subtotal
            this.CalculateDiscount(); // Recalculate the discount
            this.CalculateTotal(); // Recalculate the total
          });
      }
    }
  }

  RemoveAmountProduct(index: number, id_item: number) {
    // Decrease the quantity of a product in the cart
    if (this.productAmounts[index] > 1) {
      let oldAmount = this.productAmounts[index];
      this.productAmounts[index]--;
      if (this.productAmounts[index] != oldAmount) {
        this.cartServices
          .UpdateQuantity(this.productAmounts[index], id_item)
          .subscribe((data) => {
            this.cartItems[index].quantity = this.productAmounts[index];
            this.CalculateSubtotal(); // Recalculate the subtotal
            this.CalculateDiscount(); // Recalculate the discount
            this.CalculateTotal(); // Recalculate the total
          });
      }
    }
  }

  CalculateDiscount(): void {
    // Calculate the total discount for the cart
    let discountValue = 0;
    this.cartItems.forEach((item) => {
      let discountAmount = item.product.discount * item.quantity;
      discountValue += discountAmount;
    });
    this.discount.set(discountValue);
  }

  CalculateTotal(): void {
    // Calculate the total cost of the cart
    let totalValue = this.subtotal() - this.discount() + this.delivery;
    this.total.set(totalValue);
  }

  CalculateSubtotal(): void {
    // Calculate the subtotal for the cart
    let subtotalValue = 0;
    this.cartItems.forEach((item) => {
      subtotalValue += item.product.price * item.quantity;
    });

    this.subtotal.set(subtotalValue);
  }

  RemoveProduct(id_item: number) {
    // Remove a product from the cart
    this.cartServices.DeleteItem(id_item).subscribe((response) => {
      if (response) {
        this.cartServices.GetCartItems(this.id_cart).subscribe((items) => {
          this.toastr.success('Item removed successfully', 'Success');
          this.cartItems = items; // Update the cart items list
          if (this.cartItems.length == 0) {
            this.router.navigate([this.router.url]); // Refresh the page if the cart is empty
          }
          this.productAmounts = items.map((item: CartItems) => item.quantity);
          this.CalculateSubtotal(); // Recalculate the subtotal
          this.CalculateDiscount(); // Recalculate the discount
          this.CalculateTotal(); // Recalculate the total
        });
      }
    });
  }

  checkout() {
    // Proceed to payment
    if (this.subtotal() == 0) {
      this.toastr.error('Your cart is empty', 'Error');
      return;
    }
    const idUser = Number(this.localStorage?.getItem('id_user')) || 0;
    const amoutInCents = this.total() * 100;
    this.paymentServices
      .checkout(idUser, amoutInCents)
      .subscribe((response) => {
        if (response) {
          window.location.href = response.sessionUrl; // Redirect to the payment session URL
        }
      });
  }
}

function isCart(response: any): response is { id_cart: number } {
  // Type guard to check if the response is a cart object
  return response && typeof response.id_cart === 'number';
}
