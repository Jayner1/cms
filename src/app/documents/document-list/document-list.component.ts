import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Project Plan', 'Project plan for Q2', 'https://example.com/plan.pdf', [
      new Document(6, 'Appendix A', 'Supporting details', 'https://example.com/appendix.pdf', null)
    ]),
    new Document(2, 'Budget Report', 'Financial overview', 'https://example.com/budget.pdf', null),
    new Document(3, 'Meeting Notes', 'Notes from team meeting', 'https://example.com/notes.pdf', null),
    new Document(4, 'User Guide', 'System user manual', 'https://example.com/guide.pdf', null),
    new Document(5, 'Contract', 'Client agreement', 'https://example.com/contract.pdf', null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}