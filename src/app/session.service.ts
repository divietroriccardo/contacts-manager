import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

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
    this.snackbarService.open('Sessione non valida');
    this.router.navigate(['/login']);
    return false;
  }
}
