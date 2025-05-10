import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model'; 

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @Output() addMessageEvent = new EventEmitter<Message>();
  sender: string = '';
  subject: string = '';
  msgText: string = '';

  onSendMessage() {
    const newMessage = new Message(
      Math.floor(Math.random() * 1000), 
      this.sender,
      this.subject,
      this.msgText,
      new Date()
    );
    this.addMessageEvent.emit(newMessage);
    this.sender = '';
    this.subject = '';
    this.msgText = '';
  }

  onClear() {
    this.sender = '';
    this.subject = '';
    this.msgText = '';
  }
}