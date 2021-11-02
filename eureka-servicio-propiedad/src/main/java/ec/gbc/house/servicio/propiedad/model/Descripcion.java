package ec.gbc.house.servicio.propiedad.model;

import java.util.List;
import java.util.Map;

import ec.gbc.house.servicio.to.ListaTo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Document(value = "descripcion")
@Data
public class Descripcion {

	@Id
    private String id;

	@Field("nombre")
	@Indexed(unique=true)
	private String nombre;
	
	private Map<String,List<ListaTo>> listas;
	
	private Map<String,String> atributos;
}
