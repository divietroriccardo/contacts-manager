import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { PageService } from './../page.service';
import { ContactFormService } from '../contact-form.service';
import { ContactService } from '../contact.service';
import { DialogService } from './../dialog.service';

import { DialogComponent } from '../dialog/dialog.component';
import { Contacts } from '../contacts';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
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
    private contactService: ContactService,
    private snackBar: MatSnackBar,
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
    } else {
      this.id = this.route.snapshot.paramMap.get('id') || '';
      this.getContact();

      this.pageService.pageIsOn = 'details';

      this.pageService.id = this.id;

      this.formElements = this.formService.elements.filter(({ type: id1 }) =>
        this.elementsInDetailsForm.some((id2) => id2 === id1)
      );
    }
  }

  deleteContact(): void {
    this.dialogService.setMessage(
      `Confermi di voler eliminare ${this.getValue('firstName')?.value} ${
        this.getValue('lastName')?.value
      }?`,
      'Elimina contatto',
      'Annulla'
    );

    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contactService.deleteContact(this.id).subscribe({
          next: () => {
            this.snackBarFunction(
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
    if (this.isAllRight()) {
      this.contactService
        .addNewContact(
          this.getValue('firstName')?.value || '',
          this.getValue('lastName')?.value || '',
          this.getValue('phoneNumber')?.value || '',
          this.getValue('email')?.value || '',
          this.getValue('addressCity')?.value || '',
          this.getValue('addressStreet')?.value || ''
        )
        .subscribe({
          next: (resp) => {
            if (resp != 'Phone number already exist') {
              this.snackBarFunction(
                `Il contatto ${resp.firstName} ${resp.lastName} 
                è stato aggiunto`
              );

              this.router.navigate(['/contacts']);
            } else {
              this.snackBarFunction(
                `Il numero ${
                  this.getValue('phoneNumber')?.value
                } è stato già inserito`
              );
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  editForm(): void {
    this.pageService.pageIsOn = 'edit';

    this.pageService.titlePage = 'Modifica Contatto';

    this.formElements = this.formService.elements.filter(({ type: id1 }) =>
      this.elementsInAddForm.some((id2) => id2 === id1)
    );
  }

  editContact(): void {
    if (this.isAllRight()) {
      this.contactService
        .editContact(
          this.id,
          this.getValue('firstName')?.value || '',
          this.getValue('lastName')?.value || '',
          this.getValue('phoneNumber')?.value || '',
          this.getValue('email')?.value || '',
          this.getValue('addressCity')?.value || '',
          this.getValue('addressStreet')?.value || '',
          this.contact.isFavorite || false
        )
        .subscribe({
          next: (resp) => {
            this.snackBarFunction(
              `Il contatto ${this.getValue('firstName')?.value} ${
                this.getValue('lastName')?.value
              } è stato modificato`
            );

            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  isAllRight(): boolean {
    if (
      !this.getValue('firstName')?.hasError('required') &&
      !this.getValue('lastName')?.hasError('required') &&
      !this.getValue('phoneNumber')?.hasError('required') &&
      !this.getValue('phoneNumber')?.hasError('pattern') &&
      !this.getValue('email')?.hasError('required') &&
      !this.getValue('email')?.hasError('email')
    ) {
      return true;
    } else {
      this.snackBarFunction('Inserire tutti i campi correttamente');

      return false;
    }
  }

  snackBarFunction(text: string): void {
    this.snackBar.open(text, 'Rimuovi', {
      duration: 3000,
    });
  }

  getValue(typeToFind: string) {
    return this.formService.elements.find(({ type: el }) => el == typeToFind)
      ?.value;
  }

  getContact() {
    this.contactService.getContact(this.id).subscribe({
      next: (resp) => {
        this.contact = resp;
        this.getValue('firstName')?.setValue(this.contact.firstName || '');
        this.getValue('lastName')?.setValue(this.contact.lastName || '');
        this.getValue('phoneNumber')?.setValue(this.contact.phoneNumber || '');
        this.getValue('email')?.setValue(this.contact.email || '');
        this.getValue('addressCity')?.setValue(this.contact.addressCity || '');
        this.getValue('addressStreet')?.setValue(
          this.contact.addressStreet || ''
        );

        this.pageService.titlePage = `${this.contact.firstName} ${this.contact.lastName}`;
        this.pageService.isFavoriteContact = this.contact.isFavorite;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
