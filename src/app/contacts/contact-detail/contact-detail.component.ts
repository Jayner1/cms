import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  contact: Contact | null = null;
}