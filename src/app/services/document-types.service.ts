import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DocumentsTypes } from '../interfaces/DocumentsTypesInterface';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  getDocumentsList() {
    const url = this.path + '/Documents';
    return this.http.get<DocumentsTypes[]>(url);
  }

  setDocumentType(documentTypeObject: DocumentsTypes) {
    const url = this.path + '/Documents';
    return this.http.post(url, JSON.stringify(documentTypeObject), { headers: this.headers })
  }

  updateDocumentType(documentTypeObject: DocumentsTypes, DocumentId: number) {
    const url = this.path + '/Documents/' + DocumentId;
    return this.http.put(url, JSON.stringify(documentTypeObject), { headers: this.headers });
  }

  deleteDocumentType(documentTypeId: number) {
    const url = this.path + '/Documents/' + documentTypeId;
    return this.http.delete(url, { headers: this.headers });
  }
}
