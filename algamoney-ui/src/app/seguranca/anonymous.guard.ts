import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AnonymousGuard implements CanActivate {

  authenticated: boolean;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if (next.url[0].path === 'login') {

    //   if (!this.auth.isAccessTokenInvalido()) {

    //     this.router.navigate(['/lancamentos']);

    //     return false;
    //   } else {
    //     return this.auth.obterNovoAccessToken()
    //       .then(() => {
    //         if (this.auth.isAccessTokenInvalido()) {
    //           // this.router.navigate(['/login'])
    //           return true
    //         }
    //         this.router.navigate(['/lancamentos']);
    //         return false
    //       })
    //   }
    // }
    return true;
  }
}
