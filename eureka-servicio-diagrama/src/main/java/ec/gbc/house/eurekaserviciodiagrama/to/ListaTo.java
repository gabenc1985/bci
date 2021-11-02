package ec.gbc.house.eurekaserviciodiagrama.to;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ListaTo {
	
	@JsonProperty(value = "name")
	private String nombre;
	
	@JsonProperty(value = "value")
	private String valor;

}
