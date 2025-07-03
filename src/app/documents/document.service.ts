import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from './document.model';
import { Subject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();

  private documentsUrl = 'http://localhost:3000/api/documents'; 

  constructor(private http: HttpClient) {}

  // Return observable of documents, do not subscribe here
  getDocuments(): Observable<Document[]> {
    return this.http.get<{ message: string; documents: Document[] }>(this.documentsUrl).pipe(
      tap(response => {
        this.documents = response.documents || [];
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      }),
      map(response => response.documents || [])
    );
  }

  // Get a single document by id from the local array
  getDocument(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  // Add a new document via POST to Node API
  addDocument(newDocument: Document) {
    if (!newDocument) return;

    newDocument.id = ''; // Clear id, backend will assign

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; document: Document }>(
      this.documentsUrl,
      newDocument,
      { headers }
    ).subscribe(
      response => {
        this.documents.push(response.document);
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error => {
        console.error('Failed to add document:', error);
      }
    );
  }

  // Update existing document via PUT to Node API
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      `${this.documentsUrl}/${originalDocument.id}`,
      newDocument,
      { headers }
    ).subscribe(
      () => {
        this.documents[pos] = newDocument;
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error => {
        console.error('Failed to update document:', error);
      }
    );
  }

  // Delete a document via DELETE to Node API
  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.http.delete(`${this.documentsUrl}/${document.id}`)
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error => {
          console.error('Failed to delete document:', error);
        }
      );
  }
}
