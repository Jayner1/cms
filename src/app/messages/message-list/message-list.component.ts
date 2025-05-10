import { Component } from '@angular/core';
import { Message } from '../message.model'; 

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'John Doe', 'Greetings', 'Hello, how are you?', new Date('2025-05-10T10:00:00')),
    new Message(2, 'Jane Smith', 'Meeting', 'Meeting at 2 PM today.', new Date('2025-05-10T11:30:00')),
    new Message(3, 'Alice Johnson', 'Code Review', 'Can you review my code?', new Date('2025-05-10T12:15:00')),
    new Message(4, 'Bob Wilson', 'Lunch', 'Lunch plans?', new Date('2025-05-10T13:00:00'))
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}