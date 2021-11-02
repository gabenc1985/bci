package ec.gbc.house.servicio.controller;

import ec.gbc.house.servicio.propiedad.service.PropiedadServicio;
import ec.gbc.house.servicio.to.CatalogoTo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@RestController
@RefreshScope
public class PropiedadController {

	@Autowired
	private PropiedadServicio servicio;

	@GetMapping("/all")
	public List<CatalogoTo> all() {
		return servicio.obtenerTodosLosCatalogos();
	}

	@PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON,
			produces = MediaType.APPLICATION_JSON)
	public String save(@RequestBody CatalogoTo catalogoTo){
		return servicio.guardarActualizarCatalogo(catalogoTo);
	}

	@GetMapping(value = "/find/{id}",
			produces = MediaType.APPLICATION_JSON)
	public CatalogoTo save(@PathVariable("id") String id){
		return servicio.buscarCatalogoPorId(id);
	}
	@GetMapping(value = "/components",
			produces = MediaType.APPLICATION_JSON)
	public List<CatalogoTo> getList(){
		return servicio.obtenerListadoComponentes();
	}

	@GetMapping(value = "/findName/{name}",
			produces = MediaType.APPLICATION_JSON)
	public CatalogoTo findByName(@PathVariable("name") String name){
		return servicio.buscarCatalogoPorName(name);
	}
}
