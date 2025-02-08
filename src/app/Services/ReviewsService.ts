import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private baseUrl = 'http://localhost:8000/api/v1/reviews/';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getReviews(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(`${this.baseUrl}/getRandomReviews`);
    } else {
      return of([]);
    }
  }

  getReviewsByIdProduct(
    productId: number,
    page: number,
    PageSize: number,
    sort: string
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      params = params.set('productId', productId);
      params = params.set('page', page);
      params = params.set('pageSize', PageSize);
      params = params.set('sort', sort);

      return this.http.get(`${this.baseUrl}/getReviewsByIdProduct`, { params });
    } else {
      return of([]);
    }
  }
}
