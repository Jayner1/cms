import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  draggedContact = new Subject<Contact>();
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS.slice();
    if (this.contacts.length === 0) {
      console.warn('MOCKCONTACTS is empty');
    }
    this.maxContactId = this.getMaxId();
    console.log('Initialized contacts:', this.contacts, 'maxId:', this.maxContactId);
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      console.error('Attempted to add null contact');
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    console.log('Added contact:', newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      console.error('Invalid contact data for update');
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      console.warn('Original contact not found');
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    console.log('Updated contact:', newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      console.error('Attempted to delete null contact');
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      console.warn('Contact not found for deletion');
      return;
    }
    this.contacts.splice(pos, 1);
    console.log('Deleted contact with id:', contact.id);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  emitDraggedContact(contact: Contact) {
    if (!contact) {
      console.warn('No contact to drag');
      return;
    }
    this.draggedContact.next(contact);
    console.log('Emitted dragged contact:', contact);
  }
}