import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Bill } from '../interfaces/BillsInterface';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getBillsList() {
    const url = this.path + '/Bills';
    return this.http.get<Bill[]>(url);
  }

  setBill(userObject: Bill) {
    const url = this.path + '/Bills';

    return this.http.post(url, JSON.stringify(userObject), {
      headers: this.headers,
    });
  }

  updateBill(userObject: Bill, userId: number) {
    const url = this.path + '/Bills/' + userId;
    return this.http.put(url, JSON.stringify(userObject), {
      headers: this.headers,
    });
  }

  reloadBillsList() {
    this.getBillsList().subscribe((usersList) => {
      return usersList;
    });
  }

  deleteBill(userId: number) {
    const url = this.path + '/Bills/' + userId;
    return this.http.delete(url, { headers: this.headers });
  }
}
