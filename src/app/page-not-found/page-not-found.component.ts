import { PageService } from './../page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private pageService: PageService){}

  ngOnInit(): void {
      this.pageService.pageIsOn = "404"
  }

}
