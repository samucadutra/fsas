import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ToastyService } from 'ng2-toasty';

import { PessoaService } from 'app/pessoas/pessoa.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Lancamento } from '../../core/model';
import { LancamentoService } from '../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ]

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();
  salvando = false

  constructor(
    private pessoaService: PessoaService,
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {

    const codigoLancamento = this.route.snapshot.params['codigo']

    this.title.setTitle('Novo lançamento')

    if(codigoLancamento) {
      this.carregarLancamento(codigoLancamento)
    }

    this.carregarCategorias()
    this.carregarPessoas()
  }

  get editando(){
    return Boolean(this.lancamento.codigo)
  }

  carregarLancamento(codigo: number) {

    this.lancamentoService.buscarPorCodigo(codigo)
    .then(lancamento => {
      this.lancamento = lancamento
      this.atualizarTituloEdicao()
    })
    .catch(erro => this.errorHandler.handle(erro))
  }

  salvar(form: FormControl){

    if(this.editando) {
      this.atualizarLancamento(form)
    }else{
      this.adicionarLancamento(form)
    }
  }

  adicionarLancamento(form: FormControl) {

    this.salvando = true
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.toasty.success('Lançamento adicionado com sucesso!')
        //form.reset(new Lancamento())
        // this.lancamento = new Lancamento()
        this.salvando = false
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo])
      })
      .catch(erro => {
        this.errorHandler.handle(erro)
        this.salvando = false
      })
  }

  atualizarLancamento(form: FormControl) {

    this.salvando = true
    this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      this.lancamento = lancamento

      this.toasty.success('Lançamento alterado com sucesso!')
      this.atualizarTituloEdicao()
      this.salvando = false
    })
    .catch(erro => {
      this.errorHandler.handle(erro)
      this.salvando = false
    })
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }))
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.filter(p => p.ativo).map(p => ({ label: p.nome, value: p.codigo }))
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  novo(form: FormControl) {
    form.reset(new Lancamento())
    this.router.navigate(['/lancamentos/novo'])
  }

  atualizarTituloEdicao(){
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`)
  }

}
