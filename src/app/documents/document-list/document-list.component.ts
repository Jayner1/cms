import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [
    new Document(1, 'Document 1', 'Description of document 1', 'https://example.com/doc1', null),
    new Document(2, 'Document 2', 'Description of document 2', 'https://example.com/doc2', null)
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
