import { Component } from '@angular/core';
import { Message } from './message.model';

@Component({
  selector: 'cms-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  selectedMessage: Message | null = null;

  onMessageSelected(message: Message) {
    this.selectedMessage = message;
  }
}