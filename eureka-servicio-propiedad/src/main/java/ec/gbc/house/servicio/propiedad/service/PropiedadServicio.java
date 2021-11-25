package ec.gbc.house.servicio.propiedad.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import ec.gbc.house.servicio.propiedad.repository.DescripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import ec.gbc.house.servicio.propiedad.to.CatalogoTo;
import ec.gbc.house.servicio.propiedad.model.Descripcion;

@Service
public class PropiedadServicio {

    @Autowired
    DescripcionRepository descripcionRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public List<CatalogoTo> obtenerTodosLosCatalogos() {
        List<Descripcion> descripciones = descripcionRepository.findAll();
        List<CatalogoTo> catalogos = new ArrayList<CatalogoTo>();
        descripciones.forEach(item -> {
            catalogos.add(catalogoToFromDescripcion(item));
        });
        return catalogos;
    }

    public String guardarActualizarCatalogo(CatalogoTo catalogoTo) {
        Descripcion save = descripcionRepository.save(descripcionFromCatalogoTo(catalogoTo));
        return save.getId();
    }


    private Descripcion descripcionFromCatalogoTo(CatalogoTo catalogo) {
        Descripcion descripcion = new Descripcion();
        descripcion.setId(catalogo.getId());
        descripcion.setAtributos(catalogo.getAtributos());
        descripcion.setNombre(catalogo.getNombre());
        descripcion.setListas(catalogo.getListas());
        descripcion.setDescripcion(catalogo.getDescription());
        return descripcion;
    }

    private CatalogoTo catalogoToFromDescripcion(Descripcion descripcion) {
        if(descripcion == null){
            return null;
        }
        CatalogoTo catalogo = new CatalogoTo();
        catalogo.setNombre(descripcion.getNombre());
        catalogo.setDescription(descripcion.getDescripcion());
        catalogo.setId(descripcion.getId());
        catalogo.setListas(descripcion.getListas());
        catalogo.setAtributos(descripcion.getAtributos());
        return catalogo;
    }

    public CatalogoTo buscarCatalogoPorId(String id) {
        Optional<Descripcion> descripcionOptional = this.descripcionRepository.findById(id);
        return catalogoToFromDescripcion(descripcionOptional.orElse(null));
    }

    public List<CatalogoTo> obtenerListadoComponentes() {
        Query query = new Query();
        query.fields().include("id", "nombre");
        List<Descripcion> descripciones = mongoTemplate.find(query, Descripcion.class);// null;//descripcionRepository.findDescripcionsWithCertainFields();
        return descripciones.stream()
                .map(desc -> catalogoToFromDescripcion(desc))
                .collect(Collectors.toList());
    }

    public CatalogoTo buscarCatalogoPorName(String name) {
        Descripcion descripcion = descripcionRepository.findDescripcionByNombre(name);
        if (descripcion != null) {
            return catalogoToFromDescripcion(descripcion);
        }
        return null;
    }

    public String eliminarCatalogoPorId(String id) {
        Optional<Descripcion> descripcionOptional = this.descripcionRepository.findById(id);
        if (descripcionOptional.isPresent()) {
            this.descripcionRepository.delete(descripcionOptional.get());
        }
        return id;
    }
}
