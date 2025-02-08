import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { NgFor, NgIf, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { CartService } from '../Services/CartsService';
import { catchError, switchMap, of } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { PaymentService } from '../Services/PaymentService';

interface Product {
  id_product: number;
  name: string;
  price: number;
  image: string;
  color: string;
  discount: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

@Component({
  selector: 'app-cart',
  imports: [NavbarComponent, FooterComponent, NgFor, NgIf, MatDividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  id_cart: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  delivery: number = 15;
  total: number = 0;
  id_user: String = '';
  productAmounts: any[] = [];
  private localStorage: Storage | undefined;

  constructor(
    private cartServices: CartService,
    private router: Router,
    private paymentServices: PaymentService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  ngOnInit(): void {
    this.cartServices
      .GetCart()
      .pipe(
        catchError(() => {
          return this.cartServices.CreateCart();
        }),
        switchMap((response) => {
          if (!response) {
            return this.cartServices.CreateCart();
          }
          return of(response);
        })
      )
      .subscribe((response) => {
        this.cartServices.GetCartItems(response.id_cart).subscribe((items) => {
          this.cartItems = items;
          this.id_cart = response.id_cart;
          this.productAmounts = [];
          this.productAmounts = items.map((item: CartItem) => item.quantity);
          this.CalculateSubtotal();
          this.CalculateDiscount();
          this.CalculateTotal();
        });
      });
  }

  AddAmountProduct(index: number, id_item: number): void {
    if (this.productAmounts[index] < this.cartItems[index].product.stock) {
      let oldAmount = this.productAmounts[index];
      this.productAmounts[index]++;

      if (this.productAmounts[index] != oldAmount) {
        this.cartServices
          .UpdateQuantity(this.productAmounts[index], id_item)
          .subscribe((data) => {});
      }
    }
  }

  RemoveAmountProduct(index: number, id_item: number) {
    if (this.productAmounts[index] > 1) {
      let oldAmount = this.productAmounts[index];
      this.productAmounts[index]--;
      if (this.productAmounts[index] != oldAmount) {
        this.cartServices
          .UpdateQuantity(this.productAmounts[index], id_item)
          .subscribe((data) => {});
      }
    }
  }

  UpdateQuantity(id_item: number, new_quantity: number) {
    this.cartServices.UpdateQuantity(new_quantity, id_item);
  }

  CalculateDiscount(): void {
    this.discount = 0;
    this.cartItems.forEach((item) => {
      let discountAmount = item.product.discount * item.quantity;
      this.discount += discountAmount;
    });
  }

  CalculateTotal(): void {
    this.total = this.subtotal - this.discount + this.delivery;
  }

  CalculateSubtotal(): void {
    this.subtotal = 0;
    this.cartItems.forEach((item) => {
      this.subtotal += item.product.price * item.quantity;
    });
  }

  RemoveProduct(id_item: number) {
    this.cartServices.DeleteItem(id_item).subscribe((response) => {
      if (response) {
        this.cartServices.GetCartItems(this.id_cart).subscribe((items) => {
          this.cartItems = items;
          if (this.cartItems.length == 0) {
            this.router.navigate([this.router.url]);
          }
          this.productAmounts = [];
          this.productAmounts = items.map((item: CartItem) => item.quantity);
        });
      }
    });
  }

  checkout() {
    const idUser = Number(this.localStorage?.getItem('id_user')) || 0;
    const amoutInCents = this.total * 100;
    this.paymentServices
      .checkout(idUser, amoutInCents)
      .subscribe((response) => {
        if (response) {
          window.location.href = response.sessionUrl;
        }
      });
  }
}
