import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ToastyService } from 'ng2-toasty';

import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Pessoa } from '../../core/model';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa()
  salvando = false

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {

    const codigoPessoa = this.route.snapshot.params['codigo']

    this.title.setTitle('Nova pessoa')

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa)
    }
  }

  get editando(){
    return Boolean(this.pessoa.codigo)
  }

  carregarPessoa(codigo: number) {

    this.pessoaService.buscarPorCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa
      this.atualizarTituloEdicao()
    })
    .catch(erro => this.errorHandler.handle(erro))
  }

  salvar(form: FormControl){

    if(this.editando) {
      this.atualizarPessoa(form)
    }else{
      this.adicionarPessoa(form)
    }
  }

  adicionarPessoa(form: FormControl) {

    this.salvando = true
    this.pessoaService.adicionar(this.pessoa)
    .then((pessoaAdicionada) => {
      this.toasty.success(`${this.pessoa.nome} adicionado(a) com sucesso!`)
      form.reset(new Pessoa())
      // this.lancamento = new Lancamento()
      this.salvando = false
      this.router.navigate(['pessoas', pessoaAdicionada])
      })
      .catch(erro => {
        this.errorHandler.handle(erro)
        this.salvando = false
      })
    }

    atualizarPessoa(form: FormControl) {

      this.salvando = true
    this.pessoaService.atualizar(this.pessoa)
    .then(pessoa => {
      this.pessoa = pessoa

      this.toasty.success(`${pessoa.nome} alterado(a) com sucesso!`)
      this.atualizarTituloEdicao()
      this.salvando = false
    })
    .catch(erro => {
      this.errorHandler.handle(erro)
      this.salvando = false
    })
    }

    novo(form: FormControl) {
      form.reset(new Pessoa())
      this.router.navigate(['/pessoas/nova'])
    }

    atualizarTituloEdicao(){
      this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`)
    }
}
