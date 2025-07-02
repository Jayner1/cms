import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from './document.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  private firebaseUrl = 'https://jyangular-dd8c7-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {}

  // Get all documents (HTTP GET)
  getDocuments() {
    this.http.get<Document[]>(this.firebaseUrl).subscribe(
      (documents: Document[]) => {
        this.documents = documents || [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Failed to fetch documents:', error);
      }
    );
    return this.documents.slice();
  }

  // Get a single document by id
  getDocument(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  // Add a new document
  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  // Update existing document
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;
    const index = this.documents.findIndex(doc => doc.id === originalDocument.id);
    if (index < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[index] = newDocument;
    this.storeDocuments();
  }

  // Delete a document
  deleteDocument(document: Document) {
    if (!document) return;
    const index = this.documents.findIndex(doc => doc.id === document.id);
    if (index < 0) return;

    this.documents.splice(index, 1);
    this.storeDocuments();
  }

  // Save documents to Firebase (HTTP PUT)
  storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.firebaseUrl, documentsString, { headers: headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  // Helper to get max ID number
  getMaxId(): number {
    let maxId = 0;
    for (const doc of this.documents) {
      const currentId = parseInt(doc.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
