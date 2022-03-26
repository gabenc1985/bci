package ec.gbc.house.servicio.propiedad.to;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.List;

@Data
public class AtributoLista implements Serializable {

    @JsonProperty(value = "position")
    @Field("position")
    private Double position;

    @Field("attributes")
    @JsonProperty(value = "attributes")
    private List<Attribute> atributos;
}
