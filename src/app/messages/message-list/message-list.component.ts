import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Output() selectedMessageEvent = new EventEmitter<Message>();
  messages: Message[] = [];

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  getSenderName(senderId: string): string {
    const contact: Contact | null = this.contactService.getContact(senderId);
    return contact ? contact.name : 'Unknown';
  }

  onSelectedMessage(message: Message) {
    this.selectedMessageEvent.emit(message);
  }
}