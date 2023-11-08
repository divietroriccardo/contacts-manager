import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PageService } from '../page.service';
import { DialogService } from '../dialog.service';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  isAccountFocussed: boolean = false;
  isMenuOpen: boolean = false;

  constructor(
    public pageService: PageService,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  logout() {
    this.userService.logout().subscribe({
      next: (resp) => {
        this.sessionService.set("");
      },
      error: (resp) => {
        console.log(resp.error);
      },
    });
    this.router.navigate(['/login']);
  }

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
