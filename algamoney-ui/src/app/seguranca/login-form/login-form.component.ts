import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private title: Title,
    private location: Location,
    private messageService: MessageService,
    ) { }

  ngOnInit() {
    this.title.setTitle('Login')
    // if (!this.auth.isAccessTokenInvalido()) {

    //   this.toasty.error('Usuário já encontra-se logado')
    //   this.location.back()
      // this.router.navigate(['/lancamentos']);
    // }
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
    .then(() => {
      this.router.navigate(['/dashboard'])
    })
    .catch(erro => {
      this.errorHandler.handle(erro)
    })
  }

}
