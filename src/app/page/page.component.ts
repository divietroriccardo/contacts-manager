import { Component } from '@angular/core';
import { PageService } from '../page.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  constructor(public pageService: PageService) {}

  dialogEvent(event: boolean) {
    console.log("L'evento funziona", event);
  }
}
