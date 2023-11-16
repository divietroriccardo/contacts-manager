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
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { SessionService } from './session.service';

const canActivateFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(SessionService).canActivate();
};

const routes: Routes = [
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
    path: 'account/settings/:edit',
    component: AccountSettingsComponent,
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

  {
    path: '404',
    component: PageNotFoundComponent,
  },

  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
