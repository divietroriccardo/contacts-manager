import { Component } from '@angular/core';
import { PageService } from './../page.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  search: string = '';

  constructor(public pageService: PageService) {}

  searching() {
    console.log('Prova');
    this.search = '';
  }
}
