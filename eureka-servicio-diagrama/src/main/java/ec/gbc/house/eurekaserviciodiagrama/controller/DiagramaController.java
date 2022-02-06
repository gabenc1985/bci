package ec.gbc.house.eurekaserviciodiagrama.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import ec.gbc.house.eurekaserviciodiagrama.entities.CatalogoTo;
import ec.gbc.house.eurekaserviciodiagrama.entities.ListaTo;

@RestController
public class DiagramaController {

	@GetMapping("catalogos")
	List<CatalogoTo> all(){
		List<CatalogoTo> catalogos = new ArrayList<>();
		CatalogoTo catalogo = new CatalogoTo();
		catalogo.setNombre("bpmn:BCICompetitionTask");
		List<ListaTo> listaCatalogos = new ArrayList<>();
		ListaTo catalogo1 = new ListaTo();
		catalogo1.setNombre("a0bf42ca-c3a5-47be-8341-b9c0bb8ef270");
		catalogo1.setValor("BCI.competition");
		ListaTo catalogo2 = new ListaTo();
		catalogo2.setNombre("a0bf42ca-c3a5-47be-8341-b9c0bb8ef270");
		catalogo2.setValor("BCI.competition.2");
		listaCatalogos.add(catalogo1);
		listaCatalogos.add(catalogo2);
		Map<String, List<ListaTo>> listas = new HashMap<>(); 
		listas.put("databases", listaCatalogos);
		catalogo.setListas(listas);
		catalogos.add(catalogo);
		return catalogos ;
	}

	@PostMapping("save")
	public

	
}
