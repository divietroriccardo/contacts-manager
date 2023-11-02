import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  open(text: string): void {
    this.snackBar.open(text, 'Rimuovi', {
      duration: 3000,
    });
  }
}
