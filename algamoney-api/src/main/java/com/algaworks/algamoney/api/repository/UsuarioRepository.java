package com.algaworks.algamoney.api.repository;

import java.util.List;
import java.util.Optional;

import com.algaworks.algamoney.api.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	public Optional<Usuario> findByEmail(String email);

	public List<Usuario> findByPermissoesDescricao(String permissaoDescricao);
}
