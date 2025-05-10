import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    { id: 1, sender: 'Alice', subject: 'Hello', msgText: 'How are you?' },
    { id: 2, sender: 'Bob', subject: 'Meeting Update', msgText: 'Meeting at 3 PM tomorrow.' },
    { id: 3, sender: 'Charlie', subject: 'Invoice', msgText: 'Your invoice is ready for review.' }
  ];

  onAddMessage(message: Message) {
    this.messages.push(message); 
  }
}
