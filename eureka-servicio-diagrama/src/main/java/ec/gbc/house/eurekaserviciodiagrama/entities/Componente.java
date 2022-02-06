package ec.gbc.house.eurekaserviciodiagrama.entities;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Componente {
    private String id;
    private Integer order;
    private String name;
    private String type;
    private String value;
    private List<Componente> nexts;
    private List<Componente> previous;
}
