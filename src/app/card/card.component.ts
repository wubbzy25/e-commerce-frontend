import { Component, Input, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Router } from '@angular/router';
import { CartService } from '../Services/CartsService';
import { ProductsService } from '../Services/ProductsService';
import { catchError, switchMap, of, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { Size } from '../../interfaces/Size';

@Component({
  selector: 'app-card',
  imports: [StarRatingComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  price_discount: number = 0; // The calculated price after discount
  discount_percentage: number = 0; // The percentage of the discount
  @Input() name: string = ''; // Name of the product
  @Input() price: number = 0; // Original price of the product
  @Input() discount: number = 0; // Discount amount
  @Input() image: string = ''; // URL of the product image
  @Input() rating: number = 0; // Product rating
  @Input() id_product: number = 0; // Product ID
  sizes: Size[] = []; // List of available sizes
  SelectedProduct = {
    id_product: this.id_product,
    quantity: 1,
    size: '',
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private productsService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Fetch product details and sizes when the component initializes
    this.productsService
      .getProductById(this.id_product)
      .subscribe((product) => {
        this.sizes = product.sizes;
        if (this.sizes.length > 0) {
          this.selectRandomSize(); // Select a random size if sizes are available
        }
      });
    this.CalculatePriceDiscount(); // Calculate the discounted price and percentage
  }

  CalculatePriceDiscount() {
    // Calculate the discount price and percentage if applicable
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
    // Navigate to the product details page
    this.router.navigate(['/product-details/', id_product]);
  }

  AddCart() {
    // Add the selected product to the cart
    if (!this.SelectedProduct.size) {
      this.selectRandomSize(); // Ensure a size is selected
    }

    this.ensureCart().subscribe((response) => {
      if (response && response.id_cart) {
        this.addItemToCart(response.id_cart); // Add item to the cart if cart exists
      }
    });
  }

  /**
   * Ensures that a cart exists by retrieving or creating one.
   * @returns An Observable containing the cart response.
   */
  private ensureCart(): Observable<any> {
    return this.cartService.GetCart().pipe(
      catchError(() => this.cartService.CreateCart()), // Create cart if error occurs
      switchMap((response) => {
        if (response) {
          return of(response); // Return the existing cart
        } else {
          return this.cartService.CreateCart(); // Create and return a new cart
        }
      })
    );
  }

  /**
   * Adds an item to the cart.
   * @param id_cart The ID of the cart to add the item to.
   */
  private addItemToCart(id_cart: number): void {
    this.cartService
      .AddItemToCart(1, this.id_product, id_cart, this.SelectedProduct.size)
      .subscribe(() => {
        this.toastr.success('Item added to cart successfully!', 'Success');
      });
  }

  selectRandomSize() {
    // Select a random size from the available sizes
    if (this.sizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.sizes.length);
      this.SelectedProduct.size = this.sizes[randomIndex].name;
    }
  }
}
