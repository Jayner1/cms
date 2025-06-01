import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message | null = null;
  messageSender: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    if (this.message && this.message.sender) {
      const contact: Contact | null = this.contactService.getContact(this.message.sender);
      this.messageSender = contact ? contact.name : 'Unknown';
    }
  }
}