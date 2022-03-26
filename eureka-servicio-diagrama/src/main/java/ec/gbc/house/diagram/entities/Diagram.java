package ec.gbc.house.diagram.entities;

import java.time.ZonedDateTime;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(value = "diagramas")
@Data
public class Diagram {

	@MongoId
	private String id;

	private String name;
	
	private ZonedDateTime time;

	private String value;

	private String user;

	private String before;

}
