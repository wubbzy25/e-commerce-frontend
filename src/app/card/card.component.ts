import { Component, Input, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Router } from '@angular/router';
import { CartService } from '../Services/CartsService';
import { ProductsService } from '../Services/ProductsService';
import { catchError, switchMap, of } from 'rxjs';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [StarRatingComponent, NgIf],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  ToastInfo = {
    Title: '',
    Message: '',
    Type: false,
    Visible: false,
  };

  price_discount: number = 0;
  discount_percentage: number = 0;
  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() discount: number = 0;
  @Input() image: string = '';
  @Input() rating: number = 0;
  @Input() id_product: number = 0;
  sizes: any[] = [];
  SelectedProduct = {
    id_product: this.id_product,
    quantity: 1,
    size: '',
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService
      .getProductById(this.id_product)
      .subscribe((product) => {
        this.sizes = product.sizes;
        if (this.sizes.length > 0) {
          this.selectRandomSize();
        }
      });
    this.CalculatePriceDiscount();
  }

  CalculatePriceDiscount() {
    if (this.discount > 0 && this.discount < this.price) {
      this.price_discount = this.price - this.discount;
      this.discount_percentage = parseFloat(
        ((this.discount / this.price) * 100).toFixed(0)
      );
    } else {
      this.price_discount = 0;
      this.discount_percentage = 0;
    }
  }
  redirectViewDetails(id_product: number) {
    this.router.navigate(['/product-details/', id_product]);
  }

  AddCart() {
    if (this.sizes.length === 0) {
      console.error('No sizes available for this product.');
      return;
    }

    if (!this.SelectedProduct.size) {
      this.selectRandomSize();
    }

    this.cartService
      .GetCart()
      .pipe(
        catchError(() => {
          return this.cartService.CreateCart();
        }),
        switchMap((response) => {
          if (response && response.id_cart) {
            return of(response);
          } else {
            return this.cartService.CreateCart();
          }
        })
      )
      .subscribe((response) => {
        if (response && response.id_cart) {
          this.cartService
            .AddItemToCart(
              this.SelectedProduct.quantity,
              this.id_product,
              response.id_cart,
              this.SelectedProduct.size
            )
            .subscribe(
              (success) => {
                this.EditToastMessage(
                  'Success',
                  'Item added to cart successfully!',
                  true
                );
              },
              (error) => {
                if (error.error.message.includes('llave duplicada')) {
                  this.EditToastMessage(
                    'Error',
                    'This item is already in your cart.',
                    false
                  );
                }
              }
            );
        } else {
          console.error('Failed to create or retrieve cart.');
        }
      });
  }

  selectRandomSize() {
    if (this.sizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.sizes.length);
      this.SelectedProduct.size = this.sizes[randomIndex].name;
    }
  }

  EditToastMessage(title: string, message: string, type: boolean) {
    this.ToastInfo.Title = title;
    this.ToastInfo.Message = message;
    this.ToastInfo.Type = type;
    this.ToastInfo.Visible = true;
  }
}
