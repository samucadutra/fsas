import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


import { MoneyHttp } from './money-http';

@Injectable()
export class LogoutService {

  tokensRevokeUrl: string

  constructor(
    private http: MoneyHttp,
    private auth: AuthService) {
      this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`
      // this.tokensRevokeUrl = `http://localhost:8080/tokens/revoke`
     }

     logout() {
      return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
        .toPromise()
        .then(() => {
          this.auth.limparAccessToken();
        });
    }

}
