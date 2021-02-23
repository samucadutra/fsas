import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';

import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';

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

  constructor(private http: AuthHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`
   }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams();
    // const headers = new Headers()
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')

    params.set('page', filtro.pagina.toString())
    params.set('size', filtro.itensPorPagina.toString())

    if (filtro.descricao) {
      params.set('descricao', filtro.descricao)
    }

    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'))
    }

    if (filtro.dataVencimentoFim) {
      params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'))
    }

    return this.http
      .get(`${this.lancamentosUrl}?resumo`, { search: params })
      .toPromise()
      .then((response) => {
        const responseJson = response.json()
        const lancamentos = responseJson.content
        const resultado = {
          lancamentos: lancamentos,
          total: responseJson.totalElements
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


    return this.http.post(this.lancamentosUrl,
      JSON.stringify(lancamento))
      .toPromise()
      .then(response => response.json())
    }

    atualizar(lancamento: Lancamento): Promise<Lancamento>{

    return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`,
        JSON.stringify(lancamento))
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response.json() as Lancamento;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento>{


    return this.http.get(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response.json() as Lancamento;

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
