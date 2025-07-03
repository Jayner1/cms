import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();

  private contactsUrl = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient) {}

  // Fetch contacts from Node API
  fetchContacts() {
    this.http.get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe(
        response => {
          this.contacts = response.contacts || [];
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error => {
          console.error('Error fetching contacts:', error);
        }
      );
  }

  // Get local copy by id (fix: convert id to string before comparison)
  getContact(id: string | any): Contact | null {
    if (!id) return null;
    const idStr = id.toString(); // convert ObjectId or string to string
    return this.contacts.find(contact => contact.id.toString() === idStr) ?? null;
  }

  // Add contact via POST
  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; contact: Contact }>(
      this.contactsUrl,
      newContact,
      { headers }
    ).subscribe(
      response => {
        this.contacts.push(response.contact);
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error => {
        console.error('Failed to add contact:', error);
      }
    );
  }

  // Update contact via PUT
  updateContact(originalContact: Contact, updatedContact: Contact) {
    if (!originalContact || !updatedContact) return;

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    updatedContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      `${this.contactsUrl}/${originalContact.id}`,
      updatedContact,
      { headers }
    ).subscribe(
      () => {
        this.contacts[pos] = updatedContact;
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error => {
        console.error('Failed to update contact:', error);
      }
    );
  }

  // Delete contact via DELETE
  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete(`${this.contactsUrl}/${contact.id}`)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error => {
          console.error('Failed to delete contact:', error);
        }
      );
  }
}
