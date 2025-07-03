import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentsComponent } from './documents/documents.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';

import { MessageListComponent } from './messages/message-list/message-list.component';
import { MessageItemComponent } from './messages/message-item/message-item.component';

import { ContactsListComponent } from './contacts/contact-list/contact-list.component'; // list component
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },

  // Documents routes with children for new, detail, edit
  {
    path: 'documents',
    component: DocumentsComponent,
    children: [
      { path: 'new', component: DocumentEditComponent },
      { path: ':id', component: DocumentDetailComponent },
      { path: ':id/edit', component: DocumentEditComponent },
    ],
  },

  // Messages routes with child for detail
  {
    path: 'messages',
    component: MessageListComponent,
    children: [
      { path: ':id', component: MessageItemComponent },
    ],
  },

  // Contacts list route
  { path: 'contacts', component: ContactsListComponent },

  // Contacts new, detail, edit routes
  { path: 'contacts/new', component: ContactEditComponent },
  { path: 'contacts/:id', component: ContactDetailComponent },
  { path: 'contacts/:id/edit', component: ContactEditComponent },

  // Optional wildcard route (redirect to documents or 404)
  { path: '**', redirectTo: '/documents' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
