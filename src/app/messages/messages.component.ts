import { Component } from '@angular/core';
import { Message } from './message.model';

@Component({
  selector: 'cms-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  selectedMessage: Message | null = null;
  isNew: boolean = false;

  onMessageSelected(message: Message) {
    this.selectedMessage = message;
    this.isNew = false; // Viewing or editing existing message
  }

  onAddMessage() {
    this.selectedMessage = null; // Clear selected message
    this.isNew = true; // Flag to create a new message
  }
}
