import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document = new Document('', '', '', '', null);
  id: string = '';

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        const document = this.documentService.getDocument(this.id);
        if (document) {
          this.document = document;
        }
      }
    );
  }

  onDelete() {
    if (this.document && this.document.id) {
      this.documentService.deleteDocument(this.document.id);
      this.router.navigateByUrl('/documents');
    }
  }

  onView() {
    if (this.document && this.document.url) {
      window.open(this.document.url, '_blank');
    }
  }
}