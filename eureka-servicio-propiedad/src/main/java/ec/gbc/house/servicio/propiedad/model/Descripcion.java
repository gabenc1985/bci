package ec.gbc.house.servicio.propiedad.model;

import java.util.List;
import java.util.Map;

import ec.gbc.house.servicio.propiedad.to.ListaTo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Document(value = "componentes")
@Data
public class Descripcion {

	@Id
    private String id;

	@Field("nombre")
	@Indexed(unique=true)
	private String nombre;

	@Field("descripcion")
	private String descripcion;
	
	private Map<String,List<ListaTo>> listas;
	
	private List<ListaTo> atributos;
}
