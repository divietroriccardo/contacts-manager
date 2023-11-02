import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';

import { PageService } from './../page.service';
import { UserService } from '../user.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isHidden: boolean = true;
  user = new FormControl('rickrick', [Validators.required]);
  password = new FormControl('Rick123$', [Validators.required]);

  constructor(
    private router: Router,
    private pageService: PageService,
    private userService: UserService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit() {
    this.pageService.pageIsOn = 'login';

    this.pageService.titlePage = 'Accedi';
  }

  login() {
    if (this.isAllRight()) {
      this.userService
        .login(this.user.value || '', this.password.value || '')
        .subscribe({
          next: (resp) => {
            this.snackBar.open('Accesso effettuato');

            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            if (err.status == 400) {
              this.snackBar.open('Errore del server! Riprova più tardi');
            } else {
              this.snackBar.open('Sbagliato. Prova di nuovo');
              console.log(err);
            }
          },
        });
    }
  }

  isAllRight() {
    if (
      !this.user.hasError('required') &&
      !this.password.hasError('required')
    ) {
      return true;
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');

      return false;
    }
  }
}
