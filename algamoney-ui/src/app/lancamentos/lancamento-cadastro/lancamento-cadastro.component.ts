import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/components/common/messageservice';

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
  // lancamento = new Lancamento();
  formulario: FormGroup
  salvando = false
  uploadEmAndamento = false;

  constructor(
    private pessoaService: PessoaService,
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.configurarFormulario()
    const codigoLancamento = this.route.snapshot.params['codigo']

    this.title.setTitle('Novo lançamento')

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento)
    }

    this.carregarCategorias()
    this.carregarPessoas()
  }

  antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    const anexo = JSON.parse(event.xhr.response);

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  erroUpload(event) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo!' });

    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  // get urlUploadAnexo() {
  //   return this.lancamentoService.urlUploadAnexo();
  // }

  configurarFormulario() {

    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: []

    })
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true })
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor }}
    }
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value)
  }

  carregarLancamento(codigo: number) {

    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        // this.lancamento = lancamento
        this.formulario.patchValue(lancamento)
        this.atualizarTituloEdicao()
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  salvar() {

    if (this.editando) {
      this.atualizarLancamento()
    } else {
      this.adicionarLancamento()
    }
  }

  adicionarLancamento() {

    this.salvando = true
    this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamentoAdicionado => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!' });
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

  atualizarLancamento() {

    this.salvando = true
    this.lancamentoService.atualizar(this.formulario.value)
      .then(lancamento => {
        // this.lancamento = lancamento
        this.formulario.patchValue(lancamento)

        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento alterado com sucesso!' });
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

  novo() {
    // form.reset(new Lancamento())
    // this.formulario.reset()
    this.formulario.reset(new Lancamento())
    this.router.navigate(['/lancamentos/novo'])
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`)
  }

}
