import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  titlePage: string = ""
  id: string = ""

  isFavoriteContact: boolean = false

  pageIsOn: string = ""

  constructor() {}
}
