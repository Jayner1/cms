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
  private subscription!: Subscription;
  private documentListChangedSubscription!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    // Subscribe to event to update local documents array when it changes
    this.documentListChangedSubscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      }
    );

    // Subscribe to the Observable returned by getDocuments()
    this.documentService.getDocuments().subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      },
      error => {
        console.error('Failed to load documents in component:', error);
      }
    );
  }

  ngOnDestroy() {
    this.documentListChangedSubscription.unsubscribe();
  }

  onAddDocument() {
    this.documentService.addDocument(new Document('0', '', '', '', null));
  }
}
