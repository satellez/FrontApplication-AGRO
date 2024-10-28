import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Collection } from '../interfaces/CollectionInterfaces';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getCollectionsList() {
    const url = this.path + '/Collections';
    return this.http.get<Collection[]>(url);
  }

  setCollection(collectionObject: Collection) {
    const url = this.path + '/Collections';
    return this.http.post(url, JSON.stringify(collectionObject), { headers: this.headers })
  }

  updateCollection(collectionObject: Collection, collectionId: number) {
    const url = this.path + '/Collections/' + collectionId;
    return this.http.put(url, JSON.stringify(collectionObject), { headers: this.headers });
  }

  deleteCollection(collectionId: number) {
    const url = this.path + '/Collections/' + collectionId;
    return this.http.delete(url, { headers: this.headers });
  }
}
