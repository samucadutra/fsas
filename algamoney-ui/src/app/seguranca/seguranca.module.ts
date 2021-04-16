import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { JwtModule } from '@auth0/angular-jwt';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthService } from './auth.service';
import { MoneyHttp } from './money-http';
import { AuthGuard } from './auth.guard';
import { LogoutService } from './logout.service';
import { AnonymousGuard } from './anonymous.guard';
import { environment } from 'environments/environment';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes
      }
    }),
    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    AuthGuard,
    AnonymousGuard,
    LogoutService
  ]
})
export class SegurancaModule { }
