import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  @Output() selectedMessageEvent = new EventEmitter<Message>();
  @Output() addMessageEvent = new EventEmitter<void>();

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
  }

  onSelectedMessage(message: Message) {
    this.selectedMessageEvent.emit(message);
  }

  onAddMessage() {
    this.addMessageEvent.emit();
  }

  getSenderName(senderId: string): string {
    const contact = this.contactService.getContact(senderId);
    return contact ? contact.name : 'Unknown';
  }
}
