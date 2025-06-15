import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.router.navigate(['/contacts']);
        return;
      }
      this.contact = this.contactService.getContact(id);
      if (!this.contact) {
        this.router.navigate(['/contacts']);
      }
    });
  }

  onDelete() {
    if (this.contact) {
      this.contactService.deleteContact(this.contact);
      this.router.navigateByUrl('/contacts');
    }
  }
}