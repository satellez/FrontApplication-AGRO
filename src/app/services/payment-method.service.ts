import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { PaymentMethod } from '../interfaces/PaymentMethodInterface';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getPaymentMethodsList() {
    const url = this.path + '/PaymentMethods';
    return this.http.get<PaymentMethod[]>(url);
  }

  setPaymentMethod(paymentMethodObject: PaymentMethod) {
    const url = this.path + '/PaymentMethods';
    return this.http.post(url, JSON.stringify(paymentMethodObject), { headers: this.headers })
  }

  updatePaymentMethod(paymentMethodObject: PaymentMethod, paymentMethodId: number) {
    const url = this.path + '/PaymentMethods/' + paymentMethodId;
    return this.http.put(url, JSON.stringify(paymentMethodObject), { headers: this.headers });
  }

  deletePaymentMethod(paymentMethodId: number) {
    const url = this.path + '/PaymentMethods/' + paymentMethodId;
    return this.http.delete(url, { headers: this.headers });
  }
}
