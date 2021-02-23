import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { NotAuthenticatedError } from './money-http';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isAccessTokenInvalido()) {

      console.log('Navegação com access token inválido. Obtendo novo token...')

      return this.auth.obterNovoAccessToken()
        .then(() => {
          if (this.auth.isAccessTokenInvalido()) {
            // throw new NotAuthenticatedError();
            this.router.navigate(['/login'])
            return false
          }
          return true
        })
    } else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
      this.router.navigate(['/nao-autorizado'])
      return false
    }
    return true;
  }
}
