import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model'; 

@Component({
  selector: 'cms-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;   

  @Output() selectedContact = new EventEmitter<Contact>(); 

  onSelected() {
    this.selectedContact.emit(this.contact);  
  }
}
