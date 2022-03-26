package ec.gbc.house.servicio.propiedad.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import ec.gbc.house.servicio.propiedad.repository.ComponentRepository;
import ec.gbc.house.servicio.propiedad.to.Attribute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import ec.gbc.house.servicio.propiedad.to.Component;

@Service
public class PropertyService {

    @Autowired
    ComponentRepository descripcionRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public List<Component> obtenerTodosLosCatalogos() {
        List<ec.gbc.house.servicio.propiedad.model.Componente> descripciones = descripcionRepository.findAll();
        List<Component> catalogos = new ArrayList<Component>();
        descripciones.forEach(item -> {
            catalogos.add(catalogoToFromComponente(item, false));
        });
        return catalogos;
    }

    public String guardarActualizarCatalogo(Component catalogoTo) {
        ec.gbc.house.servicio.propiedad.model.Componente save = descripcionRepository.save(descripcionFromCatalogoTo(catalogoTo));
        return save.getId();
    }


    private ec.gbc.house.servicio.propiedad.model.Componente descripcionFromCatalogoTo(Component catalogo) {
        ec.gbc.house.servicio.propiedad.model.Componente component = new ec.gbc.house.servicio.propiedad.model.Componente();
        component.setId(catalogo.getId());
        component.setAttributes(catalogo.getAtributos());
        component.setName(catalogo.getNombre());
        component.setLists(catalogo.getListas());
        component.setDescription(catalogo.getDescription());
        component.setAlias(catalogo.getAlias());
        component.setCode(catalogo.getCode());
        component.setType(catalogo.getType());
        component.setOrder(catalogo.getOrder());
        return component;
    }

    private Component catalogoToFromComponente(ec.gbc.house.servicio.propiedad.model.Componente descripcion, Boolean isAll) {
        if(descripcion == null){
            return null;
        }
        Component catalogo = new Component();
        catalogo.setNombre(descripcion.getName());
        catalogo.setAlias(descripcion.getAlias());
        catalogo.setOrder(descripcion.getOrder());
        catalogo.setAlias(descripcion.getAlias());
        catalogo.setType(descripcion.getType());
        catalogo.setCode(descripcion.getCode());
        catalogo.setDescription(descripcion.getDescription());
        catalogo.setId(descripcion.getId());
        if(descripcion.getLists()!=null && isAll){
            descripcion.getLists().forEach((key,value)->{
                Attribute atributo = new Attribute();
                atributo.setNombre("Seleccione ..");
                atributo.setValor("");
                value.getAtributos().add(0, atributo);
            });
        }
        catalogo.setListas(descripcion.getLists());
        catalogo.setAtributos(descripcion.getAttributes());
        return catalogo;
    }

    public Component buscarCatalogoPorId(String id) {
        Optional<ec.gbc.house.servicio.propiedad.model.Componente> descripcionOptional = this.descripcionRepository.findById(id);
        return catalogoToFromComponente(descripcionOptional.orElse(null), false);
    }

    public List<Component> obtenerListadoComponentes() {
        Query query = new Query();
        query.fields().include("id", "name");
        List<ec.gbc.house.servicio.propiedad.model.Componente> descripciones = mongoTemplate.find(query, ec.gbc.house.servicio.propiedad.model.Componente.class);// null;//descripcionRepository.findDescripcionsWithCertainFields();
        return descripciones.stream()
                .map(desc -> catalogoToFromComponente(desc, false))
                .collect(Collectors.toList());
    }

    public Component buscarCatalogoPorName(String name) {
        ec.gbc.house.servicio.propiedad.model.Componente descripcion = descripcionRepository.findDescripcionByNombre(name);
        if (descripcion != null) {
            return catalogoToFromComponente(descripcion,false);
        }
        return null;
    }

    public List<Component> buscarCatalogoPorTipo(String tipo) {
        List<ec.gbc.house.servicio.propiedad.model.Componente> componentes = descripcionRepository.findDescripcionByTipo(tipo);
        if (!componentes.isEmpty()) {
            return  componentes.stream()
                    .map(componente -> catalogoToFromComponente(componente,false))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public String eliminarCatalogoPorId(String id) {
        Optional<ec.gbc.house.servicio.propiedad.model.Componente> descripcionOptional = this.descripcionRepository.findById(id);
        if (descripcionOptional.isPresent()) {
            this.descripcionRepository.delete(descripcionOptional.get());
        }
        return id;
    }
}
