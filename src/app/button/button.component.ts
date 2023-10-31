import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PageService } from '../page.service';
import { DialogService } from '../dialog.service';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  constructor(
    public pageService: PageService,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService
  ) {}

  openDialog() {
    if (
      !(this.pageService.pageIsOn === 'details') &&
      !(this.pageService.pageIsOn === 'search')
    ) {
      this.dialogService.setMessage(
        'Confermi di voler annullare le modifiche?',
        'Elimina modifiche',
        'Continua a modificare'
      );

      let dialogRef = this.dialog.open(DialogComponent);

      dialogRef
        .afterClosed()
        .subscribe((result) =>
          result ? this.router.navigate(['/contacts']) : null
        );
    } else {
      this.router.navigate(['/contacts']);
    }
  }
}
