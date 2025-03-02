import {
  Component,
  OnInit,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ProductsService } from '../Services/ProductsService';
import { isPlatformBrowser, NgClass, DOCUMENT } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { CardComponent } from '../card/card.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllProducts } from '../../interfaces/AllProducts';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports: [
    NavbarComponent,
    FooterComponent,
    MatDividerModule,
    CardComponent,
    NgFor,
    NgClass,
    NgIf,
    FormsModule,
  ],
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  Products!: AllProducts;
  IsFiltersMenuOpen: boolean = false;
  IsMobileScreen: boolean = false;
  TotalPages: number = 0;
  CurrentPage: number = 0;
  TotalProducts: number = 0;
  IsDropDownSortMenuOpen: boolean = false;
  SortOptions: string[] = [
    'Most Popular',
    'Price: Low to High',
    'Price: High to Low',
  ];
  SelectedOption: string = 'Most Popular';
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  selectedDressStyles: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;

  constructor(
    private productsService: ProductsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.checkScreenwidth(); // Check if the screen width is mobile or not
    this.fetchProducts(); // Fetch products when the component initializes
  }

  fetchProducts() {
    this.productsService
      .getAllProducts(
        this.minPrice,
        this.maxPrice,
        this.selectedColors,
        this.selectedSizes,
        this.selectedDressStyles,
        this.CurrentPage,
        9,
        this.mapSortOption(this.SelectedOption)
      )
      .subscribe((response) => {
        this.Products = response;
        this.TotalPages = response.totalPages; // Set total pages
        this.TotalProducts = response.totalElements; // Set total products
      });
  }

  toggleColor(color: string) {
    // Toggle selection of a color filter
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
  }

  toggleSize(size: string) {
    // Toggle selection of a size filter
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }

  applyFilters() {
    // Apply the selected filters
    this.fetchProducts();
  }

  toggleDressStyle(style: string) {
    // Toggle selection of a dress style filter
    const index = this.selectedDressStyles.indexOf(style);
    if (index > -1) {
      this.selectedDressStyles.splice(index, 1);
    } else {
      this.selectedDressStyles.push(style);
    }
  }

  toggleFiltersMenu() {
    // Toggle the filters menu visibility
    console.log(this.IsFiltersMenuOpen);
    this.IsFiltersMenuOpen = !this.IsFiltersMenuOpen;
    console.log(this.IsFiltersMenuOpen);
  }

  selectOption(option: string) {
    // Select a sort option and fetch products based on the selected option
    this.SelectedOption = option;
    this.IsDropDownSortMenuOpen = false;
    this.fetchProducts();
  }

  nextPage() {
    // Go to the next page of products
    if (this.CurrentPage < this.TotalPages - 1) {
      this.CurrentPage++;
      this.fetchProducts();
      this.scrollToTop(); // Scroll to top of the page
    }
  }

  hasProducts(): boolean {
    // Check if there are products in the catalog
    return (
      this.Products &&
      Array.isArray(this.Products.content) &&
      this.Products.content.length > 0
    );
  }

  previousPage() {
    // Go to the previous page of products
    if (this.CurrentPage > 0) {
      this.CurrentPage--;
      this.fetchProducts();
      this.scrollToTop(); // Scroll to top of the page
    }
  }

  mapSortOption(option: string): string {
    // Map the selected sort option to the corresponding API query parameter
    switch (option) {
      case 'Most Popular':
        return 'averageScore,desc';
      case 'Price: Low to High':
        return 'price,asc';
      case 'Price: High to Low':
        return 'price,desc';
      default:
        return 'averageScore,desc';
    }
  }

  getFilteredOptions(): string[] {
    // Get the list of sort options excluding the currently selected option
    return this.SortOptions.filter((opt) => opt !== this.SelectedOption);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Update screen width status when the window is resized
    this.checkScreenwidth();
  }

  scrollToTop() {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  checkScreenwidth() {
    // Check if the screen width is less than 768 pixels (mobile screen)
    if (isPlatformBrowser(this.platformId)) {
      this.IsMobileScreen = window.innerWidth < 768;
    }
  }
}
