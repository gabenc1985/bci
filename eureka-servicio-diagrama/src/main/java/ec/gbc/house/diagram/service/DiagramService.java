package ec.gbc.house.diagram.service;

import ec.gbc.house.diagram.entities.Diagram;
import ec.gbc.house.diagram.exception.RestException;
import ec.gbc.house.diagram.models.GetDiagramFindRequest;
import ec.gbc.house.diagram.models.PostDiagramSaveResponse;
import ec.gbc.house.diagram.models.PostDiagramSaveRequest;
import ec.gbc.house.diagram.repositorio.DiagramRepository;
import ec.gbc.house.diagram.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;

@Service
public class DiagramService {

    @Autowired
    DiagramRepository repository;

    public PostDiagramSaveResponse save(PostDiagramSaveRequest request){
        Diagram diagram = new Diagram();
        diagram.setBefore(request.getUuid());
        diagram.setTime(ZonedDateTime.now());
        diagram.setValue(request.getDiagram());
        diagram.setUser(request.getUser());
        repository.save(diagram);
        PostDiagramSaveResponse response = new PostDiagramSaveResponse();
        response.setId(diagram.getId());
        response.setStatus(Constants.STATUS_OK);
        return response;
    }

    public GetDiagramFindRequest findById(String id) throws RestException{

        Optional<Diagram> diagramOptional = repository.findById(id);
        if(diagramOptional.isPresent()){
            Diagram diagram = diagramOptional.get();
            GetDiagramFindRequest diagramFindRequest = new GetDiagramFindRequest();
            diagramFindRequest.setDiagram(diagram.getValue());
            diagramFindRequest.setNombre(diagram.getName());
            diagramFindRequest.setUser(diagram.getUser());
            diagramFindRequest.setUuid(diagram.getId());
            return diagramFindRequest;
        }
        throw new RestException(HttpStatus.NO_CONTENT, "No existe diagram");
    }
}
