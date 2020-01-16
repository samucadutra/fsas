package com.algaworks.algamoney.api.resource;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.algaworks.algamoney.api.model.Categoria;
import com.algaworks.algamoney.api.repository.CategoriaRepository;

@RestController
@RequestMapping("/categorias")
public class CategoriaResource {
	
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@GetMapping
	public List<Categoria> listar() {
		return categoriaRepository.findAll();
	}
	
	@PostMapping
	public ResponseEntity<Categoria> criar(@Valid @RequestBody Categoria categoria, HttpServletResponse response) {
		Categoria categoriaSalva = categoriaRepository.save(categoria);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri().path("/{codigo}").buildAndExpand(categoriaSalva.getCodigo()).toUri();
		
		//response.setHeader("Location", uri.toASCIIString());
		
		return ResponseEntity.created(uri).body(categoriaSalva);
	}

	/*
	 * Nova implementação depois do desafio para retornar 404 caso não encontre a categoria
	 */
	@GetMapping("/{codigo}")
	public ResponseEntity<Categoria> buscarPeloCodigo(@PathVariable Long codigo) {
		Optional<Categoria> optCategoria = categoriaRepository.findById(codigo);
		return optCategoria.isPresent() ? ResponseEntity.ok(optCategoria.get()) : ResponseEntity.notFound().build();
	}
	
	/*
	 * Implementação elegante usando map
	 */
//	@GetMapping("/{codigo}")
//	public ResponseEntity buscarPeloCodigo(@PathVariable Long codigo) {
//	  return this.categoriaRepository.findById(codigo)
//	      .map(categoria -> ResponseEntity.ok(categoria))
//	      .orElse(ResponseEntity.notFound().build());
//	}
	
	/*
	 * Implementação original
	 */
//	@GetMapping("/{codigo}")
//	public Categoria buscarPeloCodigo(@PathVariable Long codigo) {
//		return categoriaRepository.findById(codigo).orElse(null);
//	}
	
	
	/*
	 * Mesmo método de busca individual, porém usando o método do JPARepsitory findOne
	 * 
	 * É importante lembrar que para o método findOne, você não precisa passar apenas o código, 
	 * mas pode criar um exemplo com um ou mais campos da sua entidade, contanto que na sua base 
	 * de dados não exista mais que um registro que contemple esse exemplo.
	 * 
	 */
//	@GetMapping("/{codigo}")
//	public Categoria buscarPeloCodigo(@PathVariable Long codigo) {
//	    Categoria categoriaExample = new Categoria();
//	    categoriaExample.setCodigo(codigo);
//	    
//	    Example example = Example.of(categoriaExample);
//	    
//	    return this.categoriaRepository.findOne(example).orElse(null);
//	}
}
