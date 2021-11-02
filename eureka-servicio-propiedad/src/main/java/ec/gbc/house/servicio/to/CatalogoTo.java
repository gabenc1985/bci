package ec.gbc.house.servicio.to;

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
	
	private Map<String,List<ListaTo>> listas;
	
	private Map<String,String> atributos;

}
