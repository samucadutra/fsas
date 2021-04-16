import { MoneyHttp } from './../seguranca/money-http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';

import * as moment from 'moment';


import { Lancamento } from '../core/model';

export class LancamentoFiltro {
  descricao: string
  dataVencimentoInicio: Date
  dataVencimentoFim: Date
  pagina = 0
  itensPorPagina = 5
}

@Injectable()
export class LancamentoService {
  lancamentosUrl: string

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`
   }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao)
    }

    if (filtro.dataVencimentoInicio) {
      params = params.append('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'))
    }

    if (filtro.dataVencimentoFim) {
      params = params.append('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'))
    }

    return this.http
      .get<any>(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then((response) => {

        const lancamentos = response.content
        const resultado = {
          lancamentos: lancamentos,
          total: response.totalElements
        }
        return resultado
      });
  }

  excluir(codigo: number): Promise<void> {

    return this.http
      .delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null)
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
      .toPromise()
    }

    atualizar(lancamento: Lancamento): Promise<Lancamento>{

    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento)
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento>{


    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response
        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
  }

  converterStringsParaDatas(lancamentos: Lancamento[]) {

    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    }

  }

  /** Atualizar para código mais moderno quando atualizar a versão do Angular */

  // atualizar(lancamento: Lancamento): Promise<Lancamento> {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  //   headers = headers.append('Content-Type', 'application/json');

  //   return this.http.put<Lancamento>(this.lancamentosUrl, Lancamento.toJson(lancamento), {headers})
  //     .toPromise()
  //     .then( lancamentoAtualizado => {
  //       const arrayLancamentos = new Array();
  //       arrayLancamentos.push(lancamentoAtualizado);
  //       const arrayLancamentosConvertido = this.converterStringsParaDatas(arrayLancamentos);
  //       return arrayLancamentosConvertido[0];
  //     });
  // }

  // buscaPorCodigo(codigo: number): Promise<Lancamento> {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  //   headers = headers.append('Content-Type', 'application/json');

  //   return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`, {headers})
  //     .toPromise()
  //     .then( lancamento => {
  //       const arrayLancamentos = new Array();
  //       arrayLancamentos.push(lancamento);
  //       const arrayLancamentosConvertido = this.converterStringsParaDatas(arrayLancamentos);
  //       return arrayLancamentosConvertido[0];
  //     });
  // }

  // private converterStringsParaDatas(lancamentos: Array<Lancamento>) {
  //   return lancamentos.map( lancamento => {
  //     return {
  //     ...lancamento,
  //     dataVencimento: moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate(),
  //     dataPagamento: lancamento.dataPagamento ? moment(lancamento.dataPagamento, 'YYYY-MM-DD').toDate() : null
  //     };
  //   });

  // }

}
