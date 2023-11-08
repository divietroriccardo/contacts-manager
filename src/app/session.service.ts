import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private router: Router) {}

  get() {
    return sessionStorage.getItem('sessionID') || '';
  }

  set(sessionID: string) {
    sessionStorage.setItem('sessionID', sessionID);
  }

  canActivate() {
    if (sessionStorage.getItem('sessionID')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
