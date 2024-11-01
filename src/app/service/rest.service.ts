import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, Product, ProductForm } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private urlProducts = 'http://localhost:3000/products';
  private urlOrders = 'http://localhost:3000/orders';

  private http = inject(HttpClient);

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(this.urlOrders);
  }

  getProducts(): Observable<ProductForm[]>{
    return this.http.get<ProductForm[]>(this.urlProducts);
  }

  postOrder(order: Order): Observable<Order>{
    return this.http.post<Order>(this.urlOrders, order);
  }
}
