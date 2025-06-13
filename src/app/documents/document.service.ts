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

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id.toString() === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    return this.documents.length > 0 ? Math.max(...this.documents.map(doc => doc.id)) : 0;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = this.getMaxId() + 1;
    this.documents.push(document);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(index: number, newDocument: Document) {
    if (index < 0 || index >= this.documents.length || !newDocument) {
      return;
    }
    this.documents[index] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }
}