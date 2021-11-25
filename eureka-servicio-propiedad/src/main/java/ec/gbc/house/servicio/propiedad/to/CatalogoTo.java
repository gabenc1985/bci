package ec.gbc.house.servicio.propiedad.to;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonInclude(value = Include.NON_NULL)
public class CatalogoTo {
	
	private String id;
	
	@JsonProperty(value = "name")
	private String nombre;

	@JsonProperty(value = "description")
	private String description;

	@JsonProperty(value = "list")
	private Map<String,List<ListaTo>> listas;

	@JsonProperty(value = "attributes")
	private List<ListaTo> atributos;

}
