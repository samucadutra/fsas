import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common'
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api'
import { ToastyService } from 'ng2-toasty';

import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from 'app/seguranca/auth.service';



@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0
  filtro = new LancamentoFiltro();
  lancamentos = [];
  @ViewChild('tabela') grid;

  constructor(
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private confirmation: ConfirmationService,
    private decimalPipe: DecimalPipe,
    private title: Title,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // this.pesquisar();
    this.title.setTitle('Pesquisa de lançamentos')
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina
    this.filtro.pagina === 0 ? this.grid.first = 0 : this.grid.first = this.grid.first

    this.lancamentoService
      .pesquisar(this.filtro)
      .then((resultado) => {
        this.totalRegistros = resultado.total
        this.lancamentos = resultado.lancamentos
      }).catch(erro => this.errorHandler.handle(erro))
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows
    this.pesquisar(pagina)
  }

  confirmarExclusao(lancamento: any) {
    const valorFormatado = this.decimalPipe.transform(lancamento.valor, '1.2-2');
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir o lançamento ${lancamento.descricao} no valor de
      ${valorFormatado}?`,
      accept: () => {
        this.excluir(lancamento)
      }
    })
  }

  excluir(lancamento: any) {

    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        // Essa solução irá para a página inicial
        // if(this.grid.first === 0){
        //   this.pesquisar()
        // }else{
        //   this.grid.first = 0
        // }

        // Essa solução vai manter na mesma página
        if (this.lancamentos.length === 1 &&
          this.filtro.pagina > 0) {
          this.grid.first = (this.filtro.pagina - 1)
            * this.filtro.itensPorPagina; // que dispara o evento e chama o pesquisar na página anterior
        } else {
          this.pesquisar(this.filtro.pagina); // pesquisa na página atual
        }

        this.toasty.success('Lançamento excluído com sucesso')

      }).catch(erro => this.errorHandler.handle(erro))
  }
}
