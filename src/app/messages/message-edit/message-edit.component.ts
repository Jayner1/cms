import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { MessageService } from '../message.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  newSubject: string = '';
  newMsgText: string = '';
  senderId: string = '1'; 

  constructor(
    private contactService: ContactService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSendMessage() {
    if (this.newSubject.trim() && this.newMsgText.trim()) {
      const newMessage: Message = {
        id: (this.messageService.getMessages().length + 1).toString(),
        subject: this.newSubject,
        msgText: this.newMsgText,
        sender: this.senderId
      };
      this.messageService.addMessage(newMessage);
      this.newSubject = '';
      this.newMsgText = ''; 
      this.router.navigateByUrl('/messages');
    }
  }

  onClear() {
    this.newSubject = '';
    this.newMsgText = '';
    this.router.navigateByUrl('/messages');
  }
}