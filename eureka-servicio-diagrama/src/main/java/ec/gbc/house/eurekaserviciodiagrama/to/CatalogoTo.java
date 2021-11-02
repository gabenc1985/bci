package ec.gbc.house.eurekaserviciodiagrama.to;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class CatalogoTo {
	
	private String nombre;
	
	private Map<String,List<ListaTo>> listas;
	
	private Map<String,String> atributos;

}
