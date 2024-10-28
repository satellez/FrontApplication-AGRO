import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product, ProductCategory, ProductDetails } from '../interfaces/ProductsInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {  }

  getProductsDetailsList() {
    const url = this.path + '/ProductDetails';
    return this.http.get<ProductDetails[]>(url);
  }

  updateProductDetails(productObject: ProductDetails, productId: number) {
    const url = this.path + '/ProductDetails/' + productId;
    return this.http.put(url, JSON.stringify(productObject), { headers: this.headers });
  }

  deleteProductDetail(detailProductId: number) {
    const url = this.path + '/ProductDetails/' + detailProductId;
    return this.http.delete(url, { headers: this.headers });
  }
}
