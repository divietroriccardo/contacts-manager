import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PageService } from './../page.service';
import { UserService } from '../user.service';
import { SnackbarService } from '../snackbar.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isHidden: boolean = true;

  loginFields = new FormGroup({
    user: new FormControl('divietroriccardo', [Validators.required]),
    password: new FormControl('Rick1234', [Validators.required]),
  });

  constructor(
    private router: Router,
    private pageService: PageService,
    private userService: UserService,
    private snackBar: SnackbarService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.pageService.pageIsOn = 'login';

    this.pageService.titlePage = 'Accedi';
  }

  login() {
    if (!this.loginFields.invalid) {
      this.userService
        .login(
          this.loginFields.value.user || '',
          this.loginFields.value.password || ''
        )
        .subscribe({
          next: (resp) => {
            this.sessionService.set(resp);

            this.snackBar.open('Accesso effettuato');
            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            if (err.status === 400) {
              this.snackBar.open('Errore del server! Riprova più tardi');
            } else {
              this.snackBar.open('Sbagliato. Prova di nuovo');
              console.log(err);
            }
          },
        });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }
}
