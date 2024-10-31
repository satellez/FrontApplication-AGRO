import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { UserType } from '../interfaces/UsersInterfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersTypesService {
  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getUsersTypesList() {
    const url = this.path + '/UserTypes';
    return this.http.get<UserType[]>(url);
  }

  setUsersType(userTypeObject: UserType) {
    const url = this.path + '/UserTypes';
    console.log(JSON.stringify(userTypeObject));
    return this.http.post(url, JSON.stringify(userTypeObject), { headers: this.headers })
  }

  updateUsersType(userTypeObject: UserType, userTypeId: number) {
    const url = this.path + '/UserTypes/' + userTypeId;
    
    return this.http.put(url, JSON.stringify(userTypeObject), { headers: this.headers });
  }

  deleteUsersType(userTypeId: number) {
    const url = this.path + '/UserTypes/' + userTypeId;
    return this.http.delete(url, { headers: this.headers });
  }
}
