package ec.gbc.house.diagram.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GetDiagramFindRequest {
    String uuid;
    String diagram;
    String nombre;
    String user;
}
