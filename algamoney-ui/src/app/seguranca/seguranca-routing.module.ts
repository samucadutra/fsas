import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousGuard } from './anonymous.guard';

import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent,
    // canActivate: [AnonymousGuard]
  },
]

@NgModule({

  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class SegurancaRoutingModule { }
