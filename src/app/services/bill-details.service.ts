import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { User } from '../interfaces/UsersInterfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Bill, BillDetails } from '../interfaces/BillsInterface';

@Injectable({
  providedIn: 'root'
})
export class BillDetailsService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor( private http: HttpClient) { }

  getBillsDetailsList() {
    const url = this.path + '/BillDetails';
    return this.http.get<BillDetails[]>(url);
  }

  updateBillsDetails(productObject: BillDetails, productId: number) {
    const url = this.path + '/BillDetails/' + productId;
    return this.http.put(url, JSON.stringify(productObject), { headers: this.headers });
  }

  setBillsDetails(productObject: BillDetails) {
    const url = this.path + '/BillDetails/';
    return this.http.post(url, JSON.stringify(productObject), { headers: this.headers });
  }

  deleteBillsDetail(detailProductId: number) {
    const url = this.path + '/BillDetails/' + detailProductId;
    return this.http.delete(url, { headers: this.headers });
  }
}
