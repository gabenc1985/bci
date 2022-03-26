package ec.gbc.house.diagram.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class PostDiagramSaveRequest {
    String uuid;
    String diagram;
    String name;
    String user;
}
