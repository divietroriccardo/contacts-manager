import { Component } from '@angular/core';

import { PageService } from '../page.service';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  starColor: string = ""

  constructor(public pageService: PageService, private contactService: ContactService) {}

  getTitle(): string 
  {  
    return this.pageService.titlePage
  }

  getColor(): string
  {
    return this.pageService.isFavoriteContact ? "accent" : "basic"
  }

  getStar(): void
  {
    this.pageService.isFavoriteContact = !this.pageService.isFavoriteContact
    this.starColor = this.pageService.isFavoriteContact ? "accent" : "basic"

    this.contactService.editFavorite(this.pageService.id, this.pageService.isFavoriteContact)
    .subscribe({
      next: (resp) => {
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
