package com.algaworks.algamoney.api.service;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.algaworks.algamoney.api.model.Lancamento;
import com.algaworks.algamoney.api.model.Pessoa;
import com.algaworks.algamoney.api.repository.LancamentoRepository;
import com.algaworks.algamoney.api.service.exception.LancamentoDePessoaInativaException;

@Service
public class LancamentoService {
	
	@Autowired
	PessoaService pessoaService;
	
	@Autowired
	private LancamentoRepository lancamentoRepository;

	public Lancamento salvar(@Valid Lancamento lancamento) {
		Pessoa pessoa = pessoaService.buscarPessoaPeloCodigo(lancamento.getPessoa().getCodigo());
		if (pessoa.isInativo()) {
			throw new LancamentoDePessoaInativaException();
		}
		
		return lancamentoRepository.save(lancamento);
	}

}
