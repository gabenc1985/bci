package ec.gbc.house.servicio.controller;

import ec.gbc.house.servicio.propiedad.service.PropertyService;
import ec.gbc.house.servicio.propiedad.to.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;
import java.util.List;

@RestController
@RefreshScope
public class PropiedadController {

	@Autowired
	private PropertyService servicio;

	@GetMapping("/all")
	public List<Component> all() {
		return servicio.obtenerTodosLosCatalogos();
	}

	@PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON,
			produces = MediaType.APPLICATION_JSON)
	public String save(@RequestBody Component catalogoTo){
		return servicio.guardarActualizarCatalogo(catalogoTo);
	}

	@GetMapping(value = "/find/{id}",
			produces = MediaType.APPLICATION_JSON)
	public Component save(@PathVariable("id") String id){
		return servicio.buscarCatalogoPorId(id);
	}


	@DeleteMapping(value = "/delete/{id}",
			produces = MediaType.APPLICATION_JSON)
	public String delete(@PathVariable("id") String id){
		return servicio.eliminarCatalogoPorId(id);
	}

	@GetMapping(value = "/components",
			produces = MediaType.APPLICATION_JSON)
	public List<Component> getList(){
		return servicio.obtenerListadoComponentes();
	}

	@GetMapping(value = "/findName/{name}",
			produces = MediaType.APPLICATION_JSON)
	public Component findByName(@PathVariable("name") String name){
		return servicio.buscarCatalogoPorName(name);
	}

	@GetMapping(value = "/findByType/{type}",
			produces = MediaType.APPLICATION_JSON)
	public List<Component> findByType(@PathVariable("type") String type){
		return servicio.buscarCatalogoPorTipo(type);
	}
}
