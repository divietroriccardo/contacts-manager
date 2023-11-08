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

  constructor(private http: HttpClient, private sessionService : SessionService) {}

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

  logout()
  {
    const headerDict = {
      authorization: this.sessionService.get(),
    };

    const options = { headers: new HttpHeaders(headerDict) };

    return this.http.post<any>(`${this.baseURL}/logout`, null, options).pipe(
      tap((resp) => 
      {
        if (resp.status === 'fail') {
          this.status = 'error';
          throw new TypeError(`Error`);
        }
      })
    )
  }
}
