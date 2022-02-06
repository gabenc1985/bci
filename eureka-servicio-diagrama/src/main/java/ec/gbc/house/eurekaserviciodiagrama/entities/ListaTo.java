package ec.gbc.house.eurekaserviciodiagrama.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ListaTo {
	
	@JsonProperty(value = "name")
	private String nombre;
	
	@JsonProperty(value = "value")
	private String valor;

}
