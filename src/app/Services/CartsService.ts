import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl: string = 'http://localhost:8000/api/v1/shopping-cart';
  private localStorage: Storage | undefined;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  getUserId(): string | null {
    return this.localStorage ? this.localStorage.getItem('id_user') : null;
  }

  GetCart(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      const id_user = this.getUserId();
      if (id_user) {
        params = params.set('id_user', id_user);
      }
      return this.http.get(`${this.baseUrl}/GetCart`, { params }).pipe(
        tap((response: any) => {
          const id_cart = response.id_cart;
          if (id_cart && this.localStorage) {
            this.localStorage.setItem('id_cart', id_cart);
          }
        })
      );
    } else {
      return of(null);
    }
  }

  CreateCart(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let body;
      const id_user = this.getUserId();
      if (id_user) {
        body = {
          id_user: id_user,
        };
      }
      return this.http.post(`${this.baseUrl}/CreateCart`, body);
    } else {
      return of(null);
    }
  }

  GetCartItems(id_cart: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      params = params.set('id_cart', id_cart);
      return this.http.get(`${this.baseUrl}/GetItems`, { params });
    } else {
      return of([]);
    }
  }
  AddItemToCart(
    quantity: number,
    id_product: number,
    id_cart: number,
    size: string
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const body = {
        quantity: quantity,
        id_product: id_product,
        id_cart: id_cart,
        size: size,
      };
      return this.http.post(`${this.baseUrl}/AddItem`, body);
    } else {
      return of(null);
    }
  }
  UpdateQuantity(new_quantity: number, id_item: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      console.log('hola des update');
      const body = {
        new_quantity: new_quantity,
        id_item: id_item,
      };
      return this.http.put(`${this.baseUrl}/UpdateQuantity`, body);
    } else {
      return of(null);
    }
  }

  DeleteItem(id_item: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      let params = new HttpParams();
      params = params.set('id_item', id_item.toString());
      return this.http.delete(`${this.baseUrl}/DeleteItem`, { params });
    } else {
      return of(null);
    }
  }

  DeleteAllItems(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const id_cart = this.localStorage
        ? this.localStorage.getItem('id_cart')
        : null;
      let params = new HttpParams();
      if (id_cart) {
        params = params.set('id_cart', id_cart);
      }
      return this.http.delete(`${this.baseUrl}/DeleteAllItems`, { params });
    } else {
      return of(null);
    }
  }
}
