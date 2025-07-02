import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnChanges {
  @Input() message: Message | null = null;
  @Input() isNew: boolean = false;

  newSubject: string = '';
  newMsgText: string = '';
  senderId: string = '1'; // Example senderId

  // Store original message copy to use on update
  originalMessage: Message | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.originalMessage = { ...this.message };  // Clone original message for update
      this.newSubject = this.message.subject;
      this.newMsgText = this.message.msgText;
    }

    if (changes['isNew'] && this.isNew) {
      this.resetForm();
      this.originalMessage = null;
    }
  }

  onSendMessage() {
    if (this.newSubject.trim() && this.newMsgText.trim()) {
      if (this.isNew) {
        const newMessage: Message = {
          id: (this.messageService.getMessages().length + 1).toString(),
          subject: this.newSubject,
          msgText: this.newMsgText,
          sender: this.senderId
        };
        this.messageService.addMessage(newMessage);
      } else if (this.message && this.originalMessage) {
        const updatedMessage: Message = {
          ...this.originalMessage,
          subject: this.newSubject,
          msgText: this.newMsgText
        };
        this.messageService.updateMessage(this.originalMessage, updatedMessage);
      }

      this.resetForm();
      this.router.navigateByUrl('/messages');
    }
  }

  onClear() {
    this.resetForm();
    this.router.navigateByUrl('/messages');
  }

  private resetForm() {
    this.newSubject = '';
    this.newMsgText = '';
  }
}
