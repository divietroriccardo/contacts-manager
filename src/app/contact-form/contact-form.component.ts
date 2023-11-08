import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FormControl, FormGroup } from '@angular/forms';

import { PageService } from './../page.service';
import { ContactFormService } from '../contact-form.service';
import { ContactService } from '../contact.service';
import { DialogService } from './../dialog.service';
import { SnackbarService } from '../snackbar.service';

import { Contacts } from '../contacts';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  formFields = new FormGroup({});
  formElements: any = [];
  elementsInAddForm: string[] = [
    'firstName',
    'lastName',
    'phoneNumber',
    'email',
    'addressCity',
    'addressStreet',
  ];
  elementsInDetailsForm: string[] = [
    'phoneNumber',
    'email',
    'addressCity',
    'addressStreet',
  ];

  id: string = '';
  contact: Contacts = {
    _id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    addressCity: '',
    addressStreet: '',
    isFavorite: false,
  };

  constructor(
    public pageService: PageService,
    private formService: ContactFormService,
    public contactService: ContactService,
    private snackBar: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/newContact') {
      this.pageService.titlePage = 'Aggiungi Contatto';

      this.pageService.pageIsOn = 'add';

      this.formElements = this.formService.elements.filter(({ type: id1 }) =>
        this.elementsInAddForm.some((id2) => id2 === id1)
      );

      this.formElements.map((el: any) => {
        this.formFields.addControl(
          el.type,
          new FormControl('', !!el.validators ? el.validators : [])
        );
      });
    } else {
      this.id = this.route.snapshot.paramMap.get('id') || '';
      this.getContact();

      this.pageService.pageIsOn = 'details';
      this.pageService.id = this.id;
    }
  }

  deleteContact(): void {
    this.dialogService.setMessage(
      `Confermi di voler eliminare ${this.getValue('firstName').value} ${
        this.getValue('lastName').value
      }?`,
      'Elimina contatto',
      'Annulla'
    );

    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contactService.deleteContact(this.id).subscribe({
          next: () => {
            this.snackBar.open(
              `Il contatto ${this.contact.firstName} ${this.contact.lastName} è stato eliminato`
            );
            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  addNewContact(): void {
    if (!this.formFields.invalid) {
      this.contactService
        .addNewContact(
          this.formFields.get('firstName')?.value || '',
          this.formFields.get('lastName')?.value || '',
          this.formFields.get('phoneNumber')?.value || '',
          this.formFields.get('email')?.value || '',
          this.formFields.get('addressCity')?.value || '',
          this.formFields.get('addressStreet')?.value || ''
        )
        .subscribe({
          next: (resp) => {
            this.snackBar.open(
              `Il contatto ${resp.firstName} ${resp.lastName} 
                è stato aggiunto`
            );

            this.router.navigate(['/contacts']);
          },
          error: (resp) => {
            this.contactService.status = 'success';
            if (resp.error.message === 'Phone number Conflict') {
              this.snackBar.open(
                `Il numero ${
                  this.formFields.get('phoneNumber')?.value
                } è stato già inserito`
              );
            }
            if (resp.error.message === 'Email Conflict') {
              this.snackBar.open(
                `L'email ${
                  this.formFields.get('email')?.value
                } è stata già inserita`
              );
            }
            console.log(resp.error);
          },
        });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }

  editForm(): void {
    this.pageService.pageIsOn = 'edit';

    this.pageService.titlePage = 'Modifica Contatto';

    this.formElements = this.formService.elements.filter(({ type: id1 }) =>
      this.elementsInAddForm.some((id2) => id2 === id1)
    );

    this.loadFormGroup();
  }

  editContact(): void {
    if (!this.formFields.invalid) {
      this.contactService
        .editContact(
          this.id,
          this.formFields.get('firstName')?.value || '',
          this.formFields.get('lastName')?.value || '',
          this.formFields.get('phoneNumber')?.value || '',
          this.formFields.get('email')?.value || '',
          this.formFields.get('addressCity')?.value || '',
          this.formFields.get('addressStreet')?.value || '',
          this.contact.isFavorite || false
        )
        .subscribe({
          next: (resp) => {
            this.snackBar.open(
              `Il contatto ${this.getValue('firstName').value} ${
                this.getValue('lastName').value
              } è stato modificato`
            );

            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.snackBar.open('Inserire tutti i campi correttamente');
    }
  }

  getContact() {
    this.contactService.getContact(this.id).subscribe({
      next: (resp) => {
        this.contact = resp;
        this.getValue('firstName').value = this.contact.firstName || '';
        this.getValue('lastName').value = this.contact.lastName || '';
        this.getValue('phoneNumber').value = this.contact.phoneNumber || '';
        this.getValue('email').value = this.contact.email || '';
        this.getValue('addressCity').value = this.contact.addressCity || '';
        this.getValue('addressStreet').value = this.contact.addressStreet || '';

        this.pageService.titlePage = `${this.contact.firstName} ${this.contact.lastName}`;
        this.pageService.isFavoriteContact = this.contact.isFavorite;

        this.formElements = this.formService.elements.filter(({ type: id1 }) =>
          this.elementsInDetailsForm.some((id2) => id2 === id1)
        );

        this.loadFormGroup();

        this.contactService.status = 'success';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getValue(typeToFind: string) {
    return (
      this.formService.elements.find(({ type: el }) => el == typeToFind) || {
        value: '',
      }
    );
  }

  loadFormGroup() {
    this.formElements.map((el: any) =>
      this.formFields.addControl(
        el.type,
        new FormControl(el.value, el.validators ?? [])
      )
    );
  }
}
