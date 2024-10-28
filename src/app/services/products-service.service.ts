import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product, ProductCategory, ProductDetails } from '../interfaces/ProductsInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsServiceService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {  }

  getProductsList() {
    const url = this.path + '/Products';
    return this.http.get<Product[]>(url);
  }

  getProductsCategoriesList() {
    const url = this.path + '/ProductCategories';
    return this.http.get<ProductCategory[]>(url);
  }

  setProduct(productObject: Product) {
    const url = this.path + '/Products';
    return this.http.post(url, JSON.stringify(productObject), { headers: this.headers })
  }

  updateProduct(productObject: Product, productId: number) {
    const url = this.path + '/Products/' + productId;
    return this.http.put(url, JSON.stringify(productObject), { headers: this.headers });
  }

  deleteProduct(productId: number) {
    const url = this.path + '/Products/' + productId;
    return this.http.delete(url, { headers: this.headers });
  }

  setProductDetails(productDetail : ProductDetails) {
    const url = this.path + '/ProductDetails';
    return this.http.post(url, JSON.stringify(productDetail), { headers: this.headers })
  }
}
