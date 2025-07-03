import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  private messagesUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  // Fetch all messages and update local array & event
  getMessages() {
    return this.http.get<{ message: string; messages: Message[] }>(this.messagesUrl)
      .pipe(
        tap(response => {
          this.messages = response.messages || [];
          this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
          this.messageListChangedEvent.next(this.messages.slice());
        })
      );
  }

  // Get message by id from local cache
  getMessage(id: string): Message | undefined {
    return this.messages.find(m => m.id === id);
  }

  // Add message via POST
  addMessage(newMessage: Message) {
    if (!newMessage) return;

    newMessage.id = ''; // backend will assign id

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; messageObj: Message }>(
      this.messagesUrl,
      newMessage,
      { headers }
    ).subscribe(
      response => {
        this.messages.push(response.messageObj);
        this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
        this.messageListChangedEvent.next(this.messages.slice());
      },
      error => {
        console.error('Failed to add message:', error);
      }
    );
  }

  // Update message via PUT
  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      `${this.messagesUrl}/${originalMessage.id}`,
      newMessage,
      { headers }
    ).subscribe(
      () => {
        this.messages[pos] = newMessage;
        this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
        this.messageListChangedEvent.next(this.messages.slice());
      },
      error => {
        console.error('Failed to update message:', error);
      }
    );
  }

  // Delete message via DELETE
  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) return;

    this.http.delete(`${this.messagesUrl}/${message.id}`)
      .subscribe(
        () => {
          this.messages.splice(pos, 1);
          this.messageListChangedEvent.next(this.messages.slice());
        },
        error => {
          console.error('Failed to delete message:', error);
        }
      );
  }
}
