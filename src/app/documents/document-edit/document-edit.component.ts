import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  originalDocument: Document | null = null;
  document: Document = new Document('', '', '', '', null);
  editMode: boolean = false;
  id: string = '';
  private subscription: Subscription;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        console.log('Document list updated:', documents);
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'] || '';
        if (!this.id) {
          this.editMode = false;
          console.log('New document mode');
          return;
        }
        this.originalDocument = this.documentService.getDocument(this.id) ?? null;
        if (!this.originalDocument) {
          return;
        }
        this.editMode = true;
        // Deep clone the original document to avoid mutating it directly
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
        console.log('Edit mode, document:', this.document);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    console.log('onSubmit triggered, form:', form.value, 'valid:', form.valid);
    if (!form.valid) {
      console.log('Form is invalid, stopping submission');
      return;
    }

    const value = form.value;

    const newDocument = new Document(
      '', 
      value.name,
      value.description,
      value.url,
      null
    );

    if (this.editMode && this.originalDocument) {
      // UpdateDocument now expects originalDocument and newDocument objects
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    console.log('Document saved, newDocument:', newDocument);
    this.router.navigate(['/documents']);
  }

  onCancel(): void {
    this.router.navigate(['/documents']);
  }
}
