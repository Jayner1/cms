import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model'; 

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @Output() addMessageEvent = new EventEmitter<Message>(); 
  subject: string = '';
  msgText: string = '';
  currentSender: string = 'Your Name'; 

  onSendMessage() {
    if (this.subject && this.msgText) {
      const newMessage: Message = {
        id: Math.floor(Math.random() * 1000), 
        sender: this.currentSender,
        subject: this.subject,
        msgText: this.msgText
      };

      this.addMessageEvent.emit(newMessage); 
      this.onClear();  
    }
  }

  onClear() {
    this.subject = ''; 
    this.msgText = '';  
  }
}
