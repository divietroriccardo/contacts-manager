import { Injectable } from '@angular/core';
import { Contacts } from './contacts';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactsData: Contacts[] = [];
  status: string = '';
  contact = {
    _id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    addressCity: '',
    addressStreet: '',
    isFavorite: false,
  };

  baseURL: string = '/api';

  constructor(private http: HttpClient) {}

  getData() {
    this.status = 'loading';

    return this.http.get<any>(`${this.baseURL}/contacts`).pipe(
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

  getContact(idContact: string) {
    this.status = 'loading';

    return this.http.get<any>(`${this.baseURL}/details/${idContact}`).pipe(
      delay(100),
      tap((resp) => {
        if (resp.status === 'fail') {
          throw new TypeError(`Error`);
        }
      }),
      filter((resp) => resp.status === 'success'),
      map((resp) => resp.data)
    );
  }

  addNewContact(
    newContactFirstName: string,
    newContactLastName: string,
    newContactPhoneNumber: string,
    newContactEmail: string,
    newContactAddressCity: string,
    newContactAddressStreet: string
  ) {
    this.status = 'loading';

    const newContact = {
      firstName: newContactFirstName,
      lastName: newContactLastName,
      phoneNumber: newContactPhoneNumber,
      email: newContactEmail,
      addressCity: newContactAddressCity,
      addressStreet: newContactAddressStreet,
      isFavorite: false,
    };

    return this.http.post<any>(`${this.baseURL}/add`, newContact).pipe(
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

  deleteContact(idToDelete: string) {
    this.status = 'loading';

    return this.http.delete<any>(`${this.baseURL}/delete/${idToDelete}`).pipe(
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

  editContact(
    idToEdit: string,
    firstNameToEdit: string,
    lastNameToEdit: string,
    phoneNumberToEdit: string,
    emailToEdit: string,
    addressCityToEdit: string,
    addressStreetToEdit: string,
    isFavoriteToEdit: boolean
  ) {
    const update = {
      firstName: firstNameToEdit,
      lastName: lastNameToEdit,
      email: emailToEdit,
      phoneNumber: phoneNumberToEdit,
      addressCity: addressCityToEdit,
      addressStreet: addressStreetToEdit,
      isFavorite: isFavoriteToEdit,
    };
    return this.http.post<any>(`${this.baseURL}/edit/${idToEdit}`, update).pipe(
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

  editFavorite(idToUpdate: string, isFavoriteToUpdate: boolean) {
    const update = { isFavorite: isFavoriteToUpdate };

    return this.http
      .post<any>(`${this.baseURL}/favorite/${idToUpdate}`, update)
      .pipe(
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
}
