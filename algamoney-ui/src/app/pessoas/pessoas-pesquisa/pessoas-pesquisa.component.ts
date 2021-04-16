import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, LazyLoadEvent } from 'primeng/components/common/api';

import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';



@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela', { static: true }) grid;

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
    ) { }

  ngOnInit() {
    // this.pesquisar()
    this.title.setTitle('Pesquisa de pessoas')
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina

    this.filtro.pagina === 0 ? this.grid.first = 0 : this.grid.first = this.grid.first

    this.pessoaService
      .pesquisar(this.filtro)
      .then((resultado) => {
        this.totalRegistros = resultado.total
        this.pessoas = resultado.pessoas
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows
    this.pesquisar(pagina)
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir a pessoa de nome ${pessoa.nome}?`,
      accept: () => {
        this.excluir(pessoa)
      }
    })
  }

  excluir(pessoa: any) {

    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {

        // Essa solução vai manter na mesma página
        if (this.pessoas.length === 1 &&
          this.filtro.pagina > 0) {
          this.grid.first = (this.filtro.pagina - 1)
            * this.filtro.itensPorPagina; // que dispara o evento e chama o pesquisar na página anterior
        } else {
          this.pesquisar(this.filtro.pagina); // pesquisa na página atual
        }

        this.messageService.add({
          severity: 'success',
          detail: `${pessoa.nome} excluído(a) com sucesso`
        })

      }).catch(erro => this.errorHandler.handle(erro))
  }

  alternarStatus(pessoa: any): void {

    const novoStatus = !pessoa.ativo

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado(a)' : 'desativado(a)';

        pessoa.ativo = novoStatus;
        this.messageService.add({
          severity: 'success',
          detail: `${pessoa.nome} ${acao} com sucesso!`
        });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
