import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private subscription: Subscription;

  constructor(private documentService: DocumentService) {
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      }
    );
  }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddDocument() {
    this.documentService.addDocument(new Document('0', '', '', '', null));
    this.documents = this.documentService.getDocuments();
  }
}