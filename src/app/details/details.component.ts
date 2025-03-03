import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductsService } from '../Services/ProductsService';
import { ReviewsService } from '../Services/ReviewsService';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { ReviewsCardComponent } from '../reviews-card/reviews-card.component';
import { catchError } from 'rxjs/operators';
import { CartService } from '../Services/CartsService';
import { of, switchMap, throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../interfaces/Product';

import { ReviewById } from '../../interfaces/ReviewById';

@Component({
  selector: 'app-details',
  imports: [
    NavbarComponent,
    FooterComponent,
    StarRatingComponent,
    MatDividerModule,
    NgFor,
    NgIf,
    CardComponent,
    ReviewsCardComponent,
    NgClass,
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  SimilarProducts: Product[] = [];
  SelectedProduct = {
    id_product: 0,
    quantity: 1,
    size: '',
  };
  product: Product = {} as Product;
  id_product: number = 0;
  productAmount: number = 1;
  TotalPages: number = 0;
  IsDropDownMenuReviewsOpen: boolean = false;
  SelectSortReviewOption: string = 'Latest';
  SortReviewsOptions: string[] = [
    'Latest',
    'Oldest',
    'Highest Score',
    'Lowest Score',
  ];
  CurrentPage: number = 0;
  Reviews!: ReviewById;
  selectedSizes: string[] = [];
  price_discount: number = 0;
  discount_percentage: number = 0;

  constructor(
    private productsService: ProductsService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id_product = +params['id'];
      this.fetchReviews(this.id_product);
      this.productsService
        .getProductById(this.id_product)
        .subscribe((response) => {
          if (response) {
            this.product = response;

            this.SelectedProduct.id_product = response.id_product;
            this.productAmount = 1;
            this.selectedSizes = [];
            this.updateSelectedProduct();
            this.CalculatePriceDiscount(response.discount, response.price);
          }
        });
    });

    this.productsService.getSimilarProducts().subscribe((response) => {
      this.SimilarProducts = response;
    });
  }

  fetchReviews(id: number) {
    this.reviewsService
      .getReviewsByIdProduct(
        id,
        this.CurrentPage,
        9,
        this.mapSortOption(this.SelectSortReviewOption)
      )
      .subscribe((response) => {
        this.Reviews = response;
      });
  }

  nextPage() {
    if (this.CurrentPage < this.TotalPages - 1) {
      this.CurrentPage++;
    }
  }

  toggleSize(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = [];
    } else {
      this.selectedSizes = [size];
    }
    this.updateSelectedProduct();
  }

  ToggleDropDownReviewsMenu() {
    this.IsDropDownMenuReviewsOpen = !this.IsDropDownMenuReviewsOpen;
  }

  AddAmountProduct() {
    if (this.productAmount < this.product.stock) {
      this.productAmount++;
      this.updateSelectedProduct();
    }
  }

  RemoveAmountProduct() {
    if (this.productAmount > 1) {
      this.productAmount--;
      this.updateSelectedProduct();
    }
  }

  CalculatePriceDiscount(discount: number, price: number) {
    if (discount > 0 && discount < price) {
      this.price_discount = price - discount;
      this.discount_percentage = parseFloat(
        ((discount / price) * 100).toFixed(0)
      );
    } else {
      this.price_discount = 0;
      this.discount_percentage = 0;
    }
  }

  previousPage() {
    if (this.CurrentPage > 0) {
      this.CurrentPage--;
    }
  }

  mapSortOption(option: string): string {
    switch (option) {
      case 'Latest':
        return 'posted_date,asc';
      case 'Oldest':
        return 'posted_date,desc';
      case 'Highest Score':
        return 'averageScore,asc';
      case 'Lowest Score':
        return 'averageScore,desc';
      default:
        return 'averageScore,desc';
    }
  }

  getFilteredOptions(): string[] {
    return this.SortReviewsOptions.filter(
      (opt) => opt !== this.SelectSortReviewOption
    );
  }

  selectOption(option: string) {
    this.SelectSortReviewOption = option;
    this.IsDropDownMenuReviewsOpen = false;
    this.fetchReviews(this.id_product);
  }

  updateSelectedProduct() {
    this.SelectedProduct.quantity = this.productAmount;
    this.SelectedProduct.size = this.selectedSizes[0] || '';
  }

  selectRandomSize() {
    if (this.product.sizes && this.product.sizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.product.sizes.length);
      this.SelectedProduct.size = this.product.sizes[randomIndex].name;
      this.selectedSizes = [this.product.sizes[randomIndex].name];
    }
  }

  AddCart() {
    if (!this.SelectedProduct.size) {
      this.selectRandomSize();
    }

    this.ensureCart().subscribe(
      (response) => {
        if (response && response.id_cart) {
          this.addItemToCart(response.id_cart);
        } else {
          this.toastr.error('Failed to create or retrieve cart.', 'Error');
        }
      },
      (error) => {
        this.toastr.error('Failed to create or retrieve cart.', 'Error');
      }
    );
  }

  /**
   * Ensures that a cart exists by retrieving or creating one.
   * @returns An Observable containing the cart response.
   */
  private ensureCart(): Observable<any> {
    return this.cartService.GetCart().pipe(
      catchError(() => this.cartService.CreateCart()),
      switchMap((response) => {
        if (response) {
          return of(response);
        } else {
          return this.cartService.CreateCart();
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
      .AddItemToCart(
        this.SelectedProduct.quantity,
        this.SelectedProduct.id_product,
        id_cart,
        this.SelectedProduct.size
      )
      .subscribe(() => {
        this.toastr.success('Item added to cart successfully!', 'Success');
      });
  }
}
