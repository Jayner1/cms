import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId: number = 0;

  private firebaseUrl: string = 'https://jyangular-dd8c7-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http.get<Message[]>(this.firebaseUrl)
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages ?? [];
          this.maxMessageId = this.getMaxId();
          this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
    return this.messages.slice();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, messagesString, { headers })
      .subscribe(() => {
        this.messageListChangedEvent.next(this.messages.slice());
      }, error => {
        console.error('Error storing messages:', error);
      });
  }

  addMessage(newMessage: Message) {
    if (!newMessage) return;

    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages();
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;
    this.messages[pos] = newMessage;
    this.storeMessages();
  }

  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) return;

    this.messages.splice(pos, 1);
    this.storeMessages();
  }
}
