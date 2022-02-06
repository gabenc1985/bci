package ec.gbc.house.servicio.propiedad.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ec.gbc.house.servicio.propiedad.model.Componente;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentRepository extends MongoRepository<Componente, String> {

    @org.springframework.data.mongodb.repository.Query("{ 'nombre' : ?0 }")
    Componente findDescripcionByNombre(String nombre);

    @org.springframework.data.mongodb.repository.Query("{ 'tipo' : ?0 }")
    List<Componente> findDescripcionByTipo(String tipo);

}
