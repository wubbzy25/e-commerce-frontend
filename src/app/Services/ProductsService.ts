import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl: string = 'http://localhost:8000/api/v1/catalog/products';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getTopSelling(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(`${this.baseUrl}/topSelling`);
    } else {
      return of([]);
    }
  }

  getNewArrivals(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(`${this.baseUrl}/newArrivals`);
    } else {
      return of([]);
    }
  }

  getProductById(productId: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      params = params.set('productId', productId);
      return this.http.get(`${this.baseUrl}/GetProductById`, { params });
    } else {
      return of([]);
    }
  }

  getSimilarProducts(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(`${this.baseUrl}/GetSimilarProducts`);
    } else {
      return of([]);
    }
  }

  getAllProducts(
    minPrice: number,
    maxPrice: number,
    colors: string[],
    sizes: string[],
    dressStyles: string[],
    page: number,
    size: number,
    sort: string
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();

      if (minPrice !== 0) {
        params = params.set('minPrice', minPrice.toString());
      }
      if (maxPrice !== 0) {
        params = params.set('maxPrice', maxPrice.toString());
      }
      if (colors && colors.length > 0) {
        const upperColors = colors.map((color) => color.toUpperCase());
        params = params.set('colors', upperColors.join(','));
      }
      if (sizes && sizes.length > 0) {
        params = params.set('sizes', sizes.join(','));
      }
      if (dressStyles && dressStyles.length > 0) {
        const LowerDress = dressStyles.map((dressStyles) =>
          dressStyles.toLowerCase()
        );
        params = params.set('dressStyle', LowerDress.join(','));
      }

      params = params.set('page', page.toString());
      params = params.set('size', size.toString());
      params = params.set('sort', sort);
      return this.http.get(`${this.baseUrl}/GetAllProducts`, { params });
    } else {
      return of([]);
    }
  }
}
