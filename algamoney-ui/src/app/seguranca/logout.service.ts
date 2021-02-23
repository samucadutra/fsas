import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from './auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogoutService {

  tokensRevokeUrl: string

  constructor(
    private http: AuthHttp,
    private auth: AuthService) {
      // this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`
      this.tokensRevokeUrl = `http://localhost:8080/tokens/revoke`
     }

     logout() {
      return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
        .toPromise()
        .then(() => {
          this.auth.limparAccessToken();
        });
    }

}
