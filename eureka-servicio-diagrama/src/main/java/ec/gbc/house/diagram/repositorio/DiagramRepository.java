package ec.gbc.house.diagram.repositorio;

import ec.gbc.house.diagram.entities.Diagram;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DiagramRepository extends MongoRepository<Diagram, String> {

}
