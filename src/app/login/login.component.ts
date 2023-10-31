import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageService } from './../page.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isHidden: boolean = true;
  user = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private router: Router,
    private pageService: PageService,
    private userService: UserService,
    private snackBar: MatSnackBar
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
            this.snackBarFunction('Accesso effettuato');

            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            this.snackBarFunction('Sbagliato. Prova di nuovo');
            console.log(err);
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
      this.snackBarFunction('Inserire tutti i campi correttamente');

      return false;
    }
  }

  snackBarFunction(text: string): void {
    this.snackBar.open(text, 'Rimuovi', {
      duration: 3000,
    });
  }
}
