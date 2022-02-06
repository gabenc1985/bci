package ec.gbc.house.servicio.propiedad.to;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonInclude(value = Include.NON_NULL)
public class Componente implements Serializable {
	
	private String id;

	@JsonProperty(value = "code")
	private String code;

	@JsonProperty(value = "type")
	private String type;

	@JsonProperty(value = "alias")
	private String alias;

	@JsonProperty(value = "name")
	private String nombre;

	@JsonProperty(value = "order")
	private Double order;

	@JsonProperty(value = "description")
	private String description;

	@JsonProperty(value = "list")
	private Map<String, AtributoLista> listas;

	@JsonProperty(value = "attributes")
	private List<Atributo> atributos;

}
