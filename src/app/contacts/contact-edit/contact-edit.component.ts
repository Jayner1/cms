import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit, OnDestroy {
  originalContact: Contact | null = null;
  contact: Contact = new Contact('', '', '', '', '', []);
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string = '';
  private subscription: Subscription;
  invalidDrop: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        // Optional: update UI if needed when contact list changes
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'] || '';
        if (!this.id) {
          this.editMode = false;
          this.contact = new Contact('', '', '', '', '', []);
          this.groupContacts = [];
          return;
        }
        this.originalContact = this.contactService.getContact(this.id);
        if (!this.originalContact) {
          return;
        }
        this.editMode = true;
        // Deep clone to avoid modifying original directly
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.contact.group) {
          this.groupContacts = [...this.contact.group];
        } else {
          this.groupContacts = [];
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: any): void {
    if (!form.valid) {
      return;
    }
    const value = form.value;

    // Generate new id using contactService.contacts length + 1 (converted to string)
    const newId = this.editMode
      ? this.contact.id
      : (this.contactService.contacts.length + 1).toString();

    const newContact = new Contact(
      newId,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number): void {
    if (index >= 0 && index < this.groupContacts.length) {
      this.groupContacts.splice(index, 1);
    }
  }

  onGroupDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedContact = event.previousContainer.data[event.previousIndex];
      const isDuplicate = this.groupContacts.some(c => c.id === draggedContact.id);
      if (isDuplicate) {
        this.invalidDrop = true;
        return;
      }
      this.groupContacts.splice(event.currentIndex, 0, draggedContact);
      this.invalidDrop = false;
    }
  }
}
