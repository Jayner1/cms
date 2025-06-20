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
    // Get initial contacts
    this.contacts = this.contactService.getContacts();

    // Subscribe to changes so UI updates when contact list changes
    this.contactsChangedSubscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  // Search method updates the search term
  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    // Unsubscribe when component is destroyed
    this.contactsChangedSubscription.unsubscribe();
  }
}
