package ec.gbc.house.servicio.propiedad.to;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;

@Data
public class Attribute implements Serializable {
	
	@JsonProperty(value = "name")
	@Field("name")
	private String nombre;
	
	@JsonProperty(value = "value")
	@Field("value")
	private String valor;

	@JsonProperty(value = "type")
	@Field("type")
	private String tipo;

	@JsonProperty(value = "position")
	@Field("position")
	private Double position;


}
