import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { PageService } from '../page.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  isRepeatedPasswordHidden: boolean = true;

  showDetails: boolean = false;

  signupFields = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9A-Za-z_.]{6,16}$'),
    ]),

    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('[- +()0-9]+'),
    ]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),

    repeatedPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private pageService: PageService,
    private userService: UserService,
    private snackBar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageService.pageIsOn = 'signup';

    this.pageService.titlePage = 'Crea il tuo account';
  }

  signup() {
    if (!this.signupFields.invalid) {
      this.userService
        .signup(
          this.signupFields.value.username || '',
          this.signupFields.value.email || '',
          this.signupFields.value.phoneNumber || '',
          this.signupFields.value.password || ''
        )
        .subscribe({
          next: (resp) => {
            if (resp === 'Username already exist') {
              this.snackBar.open(
                'Questo nome utente non è disponibile. Prova con un altro'
              );
            } else if (resp === 'Email already exist') {
              this.snackBar.open(
                'Un altro account usa lo stesso indirizzo email'
              );
            } else if (resp === 'Phone number already exist') {
              this.snackBar.open(
                'Un altro account usa lo stesso numero di telefono'
              );
            } else {
              this.snackBar.open('Registrazione effettuata');

              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            this.snackBar.open('Errore. Prova di nuovo');
            console.log(err);
          },
        });
    } else {
      this.signupFields.value.password ===
        this.signupFields.value.repeatedPassword ||
      this.signupFields.get('repeatedPassword')?.invalid
        ? this.snackBar.open('Inserire tutti i campi correttamente')
        : this.snackBar.open('Le password non corrispondono');
    }
  }

  getErrorMessage(field: string): string {
    switch (field) {
      case 'username':
        if (this.signupFields.get('username')?.hasError('required')) {
          return 'Inserisci un username';
        } else {
          return 'Username non valido';
        }

      case 'email':
        if (this.signupFields.get('email')?.hasError('required')) {
          return 'Inserisci la tua email';
        } else {
          return 'Email non valida';
        }

      case 'phoneNumber':
        if (this.signupFields.get('phoneNumber')?.hasError('required')) {
          return 'Inserisci il tuo numero di telefono';
        } else {
          return 'Numero di telefono valido';
        }

      case 'repeatedPassword':
        return 'Ripeti la password';

      case 'password':
        if (this.signupFields.get('password')?.hasError('required')) {
          return 'Inserisci una password';
        } else {
          return 'La password è troppo corta';
        }

      default:
        return '';
    }
  }
}
