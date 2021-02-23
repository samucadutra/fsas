import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriaService {

  categoriasUrl: string

  constructor(private http: AuthHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`
   }

  listarTodas(): Promise<any>{

    return this.http
      .get(`${this.categoriasUrl}`)
      .toPromise().then(response => response.json())
   }
}
