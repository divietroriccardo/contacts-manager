import { Component, OnInit } from '@angular/core';

import { Contacts } from '../contacts';
import { ContactService } from '../contact.service';
import { PageService } from '../page.service';
import { ContactFormService } from '../contact-form.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contactList: Contacts[] = [];
  isVisualizationChanged: boolean = false;
  search: string = '';

  constructor(
    public contactService: ContactService,
    public pageService: PageService,
    private formService: ContactFormService,
    private route: ActivatedRoute
  ) {
    this.contactService.status = 'loading';
  }

  ngOnInit(): void {
    this.pageService.titlePage = 'Contatti';
    this.pageService.pageIsOn = 'list';

    this.route.paramMap
      .pipe(map((x) => x.get('searchValue')))
      .subscribe((res) => {
        this.getList(res || '');
      });
  }

  getList(searchValue: string) {
    this.search = searchValue;
    this.contactService.getData().subscribe({
      next: (resp) => {
        this.contactList = resp;
        if (searchValue) {
          this.pageService.pageIsOn = 'search';

          this.contactList = resp.filter(
            (contact: Contacts) =>
              contact.firstName
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.lastName
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.email.toLowerCase().includes(searchValue.toLowerCase()) ||
              contact.phoneNumber
                .toLowerCase()
                .includes(searchValue.toLowerCase())
          );
        } else {
          this.pageService.pageIsOn = 'list';
          this.search = '';
        }
        this.contactService.status = 'success';
        this.contactList.sort(
          (a: Contacts, b: Contacts) =>
            +b.isFavorite - +a.isFavorite ||
            a.firstName.localeCompare(b.firstName)
        );
      },

      error: (err) => {
        this.contactService.status = 'error';
        console.log(err);
      },
    });
  }

  getSort() {
    this.isVisualizationChanged = !this.isVisualizationChanged;

    if (!this.isVisualizationChanged) {
      this.contactList.sort(
        (a: Contacts, b: Contacts) =>
          +b.isFavorite - +a.isFavorite ||
          a.firstName.localeCompare(b.firstName)
      );
    } else {
      this.contactList.sort(
        (a: Contacts, b: Contacts) =>
          +b.isFavorite - +a.isFavorite || a.lastName.localeCompare(b.lastName)
      );
    }
  }
}
