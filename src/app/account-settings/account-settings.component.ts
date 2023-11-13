import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from './../user.service';
import { PageService } from '../page.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  settingsType: string = '';
  showDetails: boolean = false;
  isOldPasswordHidden: boolean = true;

  newUsername = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9A-Za-z_.]{6,16}$'),
  ]);

  emailFields = new FormGroup({
    newEmail: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required])
  })

  newPhoneNumber = new FormControl('', [
    Validators.required,
    Validators.pattern('[- +()0-9]+'),
  ]);

  passwordFields = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),

    oldPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private snackBar: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingsType = this.route.snapshot.paramMap.get('edit') || '';

    this.pageService.pageIsOn = 'settings';

    if (this.settingsType === 'username')
      this.pageService.titlePage = 'Cambia il nome utente';

    if (this.settingsType === 'email')
      this.pageService.titlePage = 'Cambia la email';

    if (this.settingsType === 'phoneNumber')
      this.pageService.titlePage = 'Cambia il numero di telefono';

    if (this.settingsType === 'password')
      this.pageService.titlePage = 'Cambia la password';
  }

  saveNewUsername() {
    if (!this.newUsername.invalid) {
      this.userService.usernameChange(this.newUsername.value || '').subscribe({
        next: (resp) => {
          this.snackBar.open('Username modificato');

          this.router.navigate(['/contacts']);
        },

        error: (resp) => {
          if (resp.error.message === 'Username Conflict') {
            this.snackBar.open(
              'Questo nome utente non è disponibile. Prova con un altro'
            );
          }

          if (resp.error.message === 'Error') {
            this.snackBar.open('Errore. Prova di nuovo');
          }

          console.log(resp.error);
        },
      });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }

  saveNewEmail() {
    if (!this.emailFields.invalid) {
      this.userService.emailChange(this.emailFields.value.newEmail || '', this.emailFields.value.password || "").subscribe({
        next: (resp) => {
          this.snackBar.open('Email modificata');

          this.router.navigate(['/contacts']);
        },

        error: (resp) => {
          if (resp.error.message === 'Email Conflict') {
            this.snackBar.open(
              'Un altro account usa lo stesso indirizzo email'
            );
          }

          if (resp.error.message === 'Forbidden') {
            this.snackBar.open('Password errata');
          }

          if (resp.error.message === 'Error') {
            this.snackBar.open('Errore. Prova di nuovo');
          }

          console.log(resp.error);
        },
      });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }

  saveNewPhoneNumber() {
    if (!this.newPhoneNumber.invalid) {
      this.userService
        .phoneNumberChange(this.newPhoneNumber.value || '')
        .subscribe({
          next: (resp) => {
            this.snackBar.open('Numero di telefono modificato');

            this.router.navigate(['/contacts']);
          },

          error: (resp) => {
            if (resp.error.message === 'Phone number Conflict') {
              this.snackBar.open(
                'Un altro account usa lo stesso numero di telefono'
              );
            }

            if (resp.error.message === 'Error') {
              this.snackBar.open('Errore. Prova di nuovo');
            }

            console.log(resp.error);
          },
        });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }

  saveNewPassword() {
    if (
      !this.passwordFields.invalid &&
      this.passwordFields.value.oldPassword !==
        this.passwordFields.value.newPassword
    ) {
      this.userService
        .passwordChange(
          this.passwordFields.value.oldPassword || '',
          this.passwordFields.value.newPassword || ''
        )
        .subscribe({
          next: (resp) => {
            this.snackBar.open('Password modificata');

            this.router.navigate(['/contacts']);
          },

          error: (resp) => {
            if (resp.error.message === 'Forbidden') {
              this.snackBar.open('Password attuale errata');
            }

            if (resp.error.message === 'Error') {
              this.snackBar.open('Errore. Prova di nuovo');
            }

            console.log(resp.error);
          },
        });
    } else {
      if (
        this.passwordFields.value.oldPassword ===
        this.passwordFields.value.newPassword
      ) {
        this.snackBar.open(
          'La nuova password non può essere uguale a quella attuale'
        );
      } else {
        this.snackBar.open('Inserire tutti i campi correttamente');
      }
    }
  }

  getErrorMessage(field: string): string {
    switch (field) {
      case 'username':
        if (this.newUsername.hasError('required')) {
          return 'Inserisci un username';
        } else {
          return 'Username non valido';
        }

      case 'email':
        if (this.emailFields.get("newEmail")?.hasError('required')) {
          return 'Inserisci la tua email';
        } else {
          return 'Email non valida';
        }
      
      case "password":
        return "Inerisci la tua password"

      case 'phoneNumber':
        if (this.newPhoneNumber.hasError('required')) {
          return 'Inserisci il tuo numero di telefono';
        } else {
          return 'Numero di telefono valido';
        }

      case 'oldPassword':
        return 'Inserisci la tua password attuale';

      case 'newPassword':
        if (this.passwordFields.get('password')?.hasError('required')) {
          return 'Inserisci la nuova password';
        } else {
          return 'La nuova password è troppo corta';
        }

      default:
        return '';
    }
  }
}
