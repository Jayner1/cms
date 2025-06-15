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

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // When switching between editing a message and adding a new one
    if (changes['message'] && this.message) {
      // Load message data for editing
      this.newSubject = this.message.subject;
      this.newMsgText = this.message.msgText;
    }

    // If we switch to "new message" mode
    if (changes['isNew'] && this.isNew) {
      this.resetForm();
    }
  }

  onSendMessage() {
    if (this.newSubject.trim() && this.newMsgText.trim()) {
      if (this.isNew) {
        // Create new message
        const newMessage: Message = {
          id: (this.messageService.getMessages().length + 1).toString(),
          subject: this.newSubject,
          msgText: this.newMsgText,
          sender: this.senderId
        };
        this.messageService.addMessage(newMessage);
      } else if (this.message) {
        // Update existing message
        this.message.subject = this.newSubject;
        this.message.msgText = this.newMsgText;
        this.messageService.updateMessage(this.message);
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
