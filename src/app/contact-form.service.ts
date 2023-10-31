import { Injectable } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ContactFormService {
  elements = [
    {
      type: "firstName",
      label: "Nome",
      value: new FormControl("", [Validators.required]),
      placeholder: "es. Mario",
      errorMessage: (error: string) => "Inserisci il nome",
      isEditable: true
    },

    {
      type: "lastName",
      label: "Cognome",
      value: new FormControl("", [Validators.required]),
      placeholder: "es. Rossi",
      errorMessage: (error: string) => "Inserisci il cognome",
      isEditable: true
    },

    {
      type: "phoneNumber",
      label: "Numero di telefono",
      value: new FormControl("", [Validators.required, Validators.pattern("[- +()0-9]+")]),
      placeholder: "es. 3331234567",
      errorMessage: (error: string) => error == "type" ? "Numero di telefono non valido" : "Inserisci il numero di telefono",
      isEditable: false
    },

    {
      type: "email",
      label: "Email",
      value: new FormControl("", [Validators.required, Validators.email]),
      placeholder: "esempio@gmail.com",
      errorMessage: (error: string) => error == "type" ? "Email non valida" : "Inserisci la email",
      isEditable: true
    },

    {
      type: "addressCity",
      label: "Città",
      value: new FormControl(""),
      placeholder: "es. Roma",
      isEditable: true
    },

    {
      type: "addressStreet",
      label: "Indirizzo",
      value: new FormControl(""),
      placeholder: "es. via Giuseppe Garibaldi, 01",
      isEditable: true
    }
  ]

  constructor() { }
}
