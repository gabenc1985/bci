package ec.gbc.house.servicio.to;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class ListaTo {
	
	@JsonProperty(value = "name")
	@Field("name")
	private String nombre;
	
	@JsonProperty(value = "value")
	@Field("value")
	private String valor;

}
