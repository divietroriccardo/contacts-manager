import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, tap, map } from 'rxjs';

import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  status: string = '';
  baseURL: string = '/api';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  login(loginUser: string, loginPassword: string) {
    this.status = 'loading';

    const user = {
      user: loginUser,
      password: loginPassword,
    };

    return this.http.post<any>(`${this.baseURL}/login`, user).pipe(
      tap((resp) => {
        if (resp.status === 'fail') {
          this.status = 'error';
          throw new TypeError(`Error`);
        }
      }),
      filter((resp) => resp.status === 'success'),
      map((resp) => resp.data)
    );
  }

  signup(
    usernameToAdd: string,
    emailToAdd: string,
    phoneNumberToAdd: string,
    passwordToAdd: string
  ) {
    this.status = 'loading';

    const newUser = {
      username: usernameToAdd,
      email: emailToAdd,
      phoneNumber: phoneNumberToAdd,
      password: passwordToAdd,
      sessionID: '',
    };

    return this.http.post<any>(`${this.baseURL}/signup`, newUser).pipe(
      tap((resp) => {
        if (resp.status === 'fail') {
          this.status = 'error';
          throw new TypeError(`Error`);
        }
      })
    );
  }

  logout() {
    return this.http
      .post<any>(`${this.baseURL}/logout`, null, this.getHeaders())
      .pipe(
        tap((resp) => {
          if (resp.status === 'fail') {
            this.status = 'error';
            throw new TypeError(`Error`);
          }
        })
      );
  }

  usernameChange(newUsername: string) {
    return this.http
      .post<any>(
        `${this.baseURL}/usernameChange`,
        { newUsername: newUsername },
        this.getHeaders()
      )
      .pipe(
        tap((resp) => {
          if (resp.status === 'fail') {
            this.status = 'error';
            throw new TypeError(`Error`);
          }
        })
      );
  }

  emailChange(newEmail: string, password: string) {
    return this.http
      .post<any>(
        `${this.baseURL}/emailChange`,
        { newEmail: newEmail, password: password },
        this.getHeaders()
      )
      .pipe(
        tap((resp) => {
          if (resp.status === 'fail') {
            this.status = 'error';
            throw new TypeError(`Error`);
          }
        })
      );
  }

  phoneNumberChange(newPhoneNumber: string) {
    return this.http
      .post<any>(
        `${this.baseURL}/phoneNumberChange`,
        { newPhoneNumber: newPhoneNumber },
        this.getHeaders()
      )
      .pipe(
        tap((resp) => {
          if (resp.status === 'fail') {
            this.status = 'error';
            throw new TypeError(`Error`);
          }
        })
      );
  }

  passwordChange(oldPassword: string, newPassword: string) {
    const passwords = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    return this.http
      .post<any>(`${this.baseURL}/passwordChange`, passwords, this.getHeaders())
      .pipe(
        tap((resp) => {
          if (resp.status === 'fail') {
            this.status = 'error';
            throw new TypeError(`Error`);
          }
        })
      );
  }

  getHeaders() {
    const headerDict = {
      authorization: this.sessionService.get(),
    };

    return { headers: new HttpHeaders(headerDict) };
  }
}
