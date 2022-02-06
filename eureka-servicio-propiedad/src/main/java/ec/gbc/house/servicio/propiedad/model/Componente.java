package ec.gbc.house.servicio.propiedad.model;

import java.util.List;
import java.util.Map;

import ec.gbc.house.servicio.propiedad.to.Atributo;
import ec.gbc.house.servicio.propiedad.to.AtributoLista;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Document(value = "componentes")
@Data
public class Componente {

	@Id
    private String id;

	@Field("code")
	@Indexed(unique=true)
	private String code;

	@Field("type")
	private String type;

	@Field("order")
	private Double order;

	@Field("alias")
	private String alias;

	@Field("name")
	@Indexed(unique=true)
	private String name;

	@Field("description")
	private String description;
	
	private Map<String, AtributoLista> lists;
	
	private List<Atributo> attributes;
}
