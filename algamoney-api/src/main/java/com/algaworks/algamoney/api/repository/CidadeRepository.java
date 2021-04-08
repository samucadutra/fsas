package com.algaworks.algamoney.api.repository;

import java.util.List;

import com.algaworks.algamoney.api.model.Cidade;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CidadeRepository extends JpaRepository<Cidade, Long> {
	
	List<Cidade> findByEstadoCodigo(Long estadoCodigo);

}
