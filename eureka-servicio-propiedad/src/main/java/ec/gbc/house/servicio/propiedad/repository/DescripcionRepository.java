package ec.gbc.house.servicio.propiedad.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ec.gbc.house.servicio.propiedad.model.Descripcion;
import org.springframework.stereotype.Repository;

@Repository
public interface DescripcionRepository extends MongoRepository<Descripcion, String> {

    @org.springframework.data.mongodb.repository.Query("{ 'nombre' : ?0 }")
    Descripcion findDescripcionByNombre(String nombre);

}
