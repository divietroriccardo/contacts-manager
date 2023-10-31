import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { PageService } from '../page.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  isPasswordHidden: boolean = true;
  isRepeatedPasswordHidden: boolean = true;

  username = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9A-Za-z_.]{6,16}$'),
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.pattern('[- +()0-9]+'),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(
      '^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,}$'
    ),
  ]);
  repeatedPassword = new FormControl('', [Validators.required]);

  constructor(
    private pageService: PageService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageService.pageIsOn = 'signup';

    this.pageService.titlePage = 'Crea il tuo account';
  }

  signup() {
    if (this.isAllRight()) {
      this.userService
        .signup(
          this.username.value || '',
          this.email.value || '',
          this.phoneNumber.value || '',
          this.password.value || ''
        )
        .subscribe({
          next: (resp) => {
            if (resp == 'Username already exist') {
              this.snackBarFunction(
                'Questo nome utente non è disponibile. Prova con un altro'
              );
            } else if (resp == 'Email already exist') {
              this.snackBarFunction(
                'Un altro account usa lo stesso indirizzo email'
              );
            } else if (resp == 'Phone number already exist') {
              this.snackBarFunction(
                'Un altro account usa lo stesso numero di telefono'
              );
            } else {
              this.snackBarFunction('Registrazione effettuata');

              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            this.snackBarFunction('Errore. Prova di nuovo');
            console.log(err);
          },
        });
    }
  }

  getErrorMessage(field: string): string {
    switch (field) {
      case 'username':
        if (this.username.hasError('required')) {
          return 'Inserisci un username';
        } else {
          return 'Username non valido';
        }
        break;

      case 'email':
        if (this.email.hasError('required')) {
          return 'Inserisci la tua email';
        } else {
          return 'Email non valida';
        }
        break;

      case 'phoneNumber':
        if (this.phoneNumber.hasError('required')) {
          return 'Inserisci il tuo numero di telefono';
        } else {
          return 'Numero di telefono valido';
        }
        break;

      case 'repeatedPassword':
        return 'Ripeti la password';
        break;

      case 'password':
        if (this.password.hasError('required')) {
          return 'Inserisci una password';
        } else {
          if (!this.password.value?.match(/.*?[0-9]/)) {
            return 'La password deve contenere almeno un numero';
          } else if (!this.password.value?.match(/.*?[A-Z]/)) {
            return 'La password deve contenere almeno una lettera maiuscola';
          } else if (!this.password.value?.match(/.*?[a-z]/)) {
            return 'La password deve contenere almeno una lettera minuscola';
          } else if (!this.password.value?.match(/.*?[^0-9A-Za-z]/)) {
            return 'La password deve contenere almeno una carattere speciale';
          } else if ((this.password.value?.length || 0) < 8) {
            return 'La password è troppo corta';
          } else {
            return '';
          }
        }
        break;

      default:
        return '';
        break;
    }
  }

  isAllRight() {
    if (
      !this.username.hasError('required') &&
      !this.username.hasError('pattern') &&
      !this.password.hasError('required') &&
      !this.password.hasError('pattern') &&
      !this.repeatedPassword.hasError('required') &&
      !this.email.hasError('required') &&
      !this.email.hasError('email') &&
      !this.phoneNumber.hasError('required') &&
      !this.phoneNumber.hasError('pattern') &&
      !(this.password.value != this.repeatedPassword.value)
    ) {
      return true;
    } else {
      this.password.value == this.repeatedPassword.value ||
      this.repeatedPassword.invalid
        ? this.snackBarFunction('Inserire tutti i campi correttamente')
        : this.snackBarFunction('Le password non corrispondono');

      return false;
    }
  }

  snackBarFunction(text: string): void {
    this.snackBar.open(text, 'Rimuovi', {
      duration: 3000,
    });
  }
}