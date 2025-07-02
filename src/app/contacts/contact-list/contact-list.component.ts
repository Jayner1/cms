import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactsListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  private contactsChangedSubscription!: Subscription;

  term: string = ''; // Search term property

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Fetch contacts from Firebase on init
    this.contactService.fetchContacts();

    // Subscribe to update UI when contact list changes
    this.contactsChangedSubscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  // Update search term on keyup in input box
  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    this.contactsChangedSubscription.unsubscribe();
  }
}
