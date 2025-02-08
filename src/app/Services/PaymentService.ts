import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8000/api/v1/payments';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  checkout(id_user: number, total: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const body = {
        id_user: id_user,
        amount: total,
      };
      return this.http.post(`${this.baseUrl}/checkout`, body);
    } else {
      return of([]);
    }
  }

  getSuccessSession(SessionId: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      params = params.set('session_id', SessionId);
      return this.http.get(`${this.baseUrl}/success-session`, { params });
    } else {
      return of([]);
    }
  }
}
