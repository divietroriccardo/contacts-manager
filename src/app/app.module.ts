import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { DialogComponent } from './dialog/dialog.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    SearchBarComponent,
    ContactListComponent,
    TitleComponent,
    ButtonComponent,
    ContactFormComponent,
    DialogComponent,
    LoginComponent,
    SignupComponent,
    AccountSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatPasswordStrengthModule,
    MatMenuModule,
    NgIf,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
