import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() {
    this.documents = [...MOCKDOCUMENTS];
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId && !isNaN(currentId)) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find(doc => doc.id === id) || null;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(id: string, newDocument: Document) {
    if (!id || !newDocument) return;
    const pos = this.documents.findIndex(doc => doc.id === id);
    if (pos < 0) return;
    newDocument.id = id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }

  deleteDocument(id: string) {
    if (!id) return;
    const pos = this.documents.findIndex(doc => doc.id === id);
    if (pos < 0) return;
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}