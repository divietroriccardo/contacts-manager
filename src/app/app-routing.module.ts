import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';

import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SessionService } from './session.service';

const canActivateFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(SessionService).canActivate();
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },

  {
    path: 'contacts',
    component: ContactListComponent,
    canActivate: [canActivateFn],
  },

  {
    path: 'search/:searchValue',
    component: ContactListComponent,
    canActivate: [canActivateFn],
  },

  {
    path: 'details/:id',
    component: ContactFormComponent,
    canActivate: [canActivateFn],
  },

  {
    path: 'newContact',
    component: ContactFormComponent,
    canActivate: [canActivateFn],
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
