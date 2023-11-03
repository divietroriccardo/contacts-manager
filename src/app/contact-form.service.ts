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
      value: "",
      validators: [Validators.required],
      errorMessage: (error: string) => "Inserisci il nome",
      isEditable: true
    },

    {
      type: "lastName",
      label: "Cognome",
      value: "",
      validators: [Validators.required],
      errorMessage: (error: string) => "Inserisci il cognome",
      isEditable: true
    },

    {
      type: "phoneNumber",
      label: "Numero di telefono",
      value: "",
      validators: [Validators.required, Validators.pattern("[- +()0-9]+")],
      errorMessage: (error: string) => error === "type" ? "Numero di telefono non valido" : "Inserisci il numero di telefono",
      isEditable: false
    },

    {
      type: "email",
      label: "Email",
      value: "",
      validators: [Validators.required, Validators.email],
      errorMessage: (error: string) => error === "type" ? "Email non valida" : "Inserisci la email",
      isEditable: true
    },
    
    {
      type: "addressCity",
      label: "Città",
      value: "",
      isEditable: true
    },
    
    {
      type: "addressStreet",
      label: "Indirizzo",
      value: "",
      isEditable: true
    }
  ]

  constructor() { }
}
