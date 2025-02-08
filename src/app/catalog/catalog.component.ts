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
  Products: any[] = [];
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
    this.checkScreenwidth();
    this.fetchProducts();
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
        this.Products = response.content;
        this.TotalPages = response.totalPages;
        this.TotalProducts = response.totalElements;
      });
  }

  toggleColor(color: string) {
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
  }

  toggleSize(size: string) {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }

  applyFilters() {
    this.fetchProducts();
  }
  toggleDressStyle(style: string) {
    const index = this.selectedDressStyles.indexOf(style);
    if (index > -1) {
      this.selectedDressStyles.splice(index, 1);
    } else {
      this.selectedDressStyles.push(style);
    }
  }

  toggleFiltersMenu() {
    console.log(this.IsFiltersMenuOpen);
    this.IsFiltersMenuOpen = !this.IsFiltersMenuOpen;
    console.log(this.IsFiltersMenuOpen);
  }

  selectOption(option: string) {
    this.SelectedOption = option;
    this.IsDropDownSortMenuOpen = false;
    this.fetchProducts();
  }

  nextPage() {
    if (this.CurrentPage < this.TotalPages - 1) {
      this.CurrentPage++;
      this.fetchProducts();
      this.scrollToTop();
    }
  }

  hasProducts(): boolean {
    return this.Products && this.Products.length > 0;
  }

  previousPage() {
    if (this.CurrentPage > 0) {
      this.CurrentPage--;
      this.fetchProducts();
      this.scrollToTop();
    }
  }

  mapSortOption(option: string): string {
    switch (option) {
      case 'Most Popular':
        return 'averageScore,desc';
      case 'Price: Low to High':
        return 'price,asc';
      case 'Price: High to Low':
        return 'price,desc';
      default:
        return 'averageSore,desc';
    }
  }

  getFilteredOptions(): string[] {
    return this.SortOptions.filter((opt) => opt !== this.SelectedOption);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenwidth();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  checkScreenwidth() {
    if (isPlatformBrowser(this.platformId)) {
      this.IsMobileScreen = window.innerWidth < 768;
    }
  }
}
