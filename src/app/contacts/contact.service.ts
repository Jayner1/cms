import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number = 0;
  private contactsUrl = 'https://jyangular-dd8c7-default-rtdb.firebaseio.com/'; // Replace with your Firebase URL

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) ?? null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  fetchContacts() {
    this.http.get<Contact[]>(this.contactsUrl).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts ? contacts : [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  storeContacts() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(this.contactsUrl, JSON.stringify(this.contacts), { headers: headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, updatedContact: Contact) {
    if (!originalContact || !updatedContact) return;
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;
    updatedContact.id = originalContact.id;
    this.contacts[pos] = updatedContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}
