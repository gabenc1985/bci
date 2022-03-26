package ec.gbc.house.diagram.controller;

import ec.gbc.house.diagram.exception.RestException;
import ec.gbc.house.diagram.models.GetDiagramFindRequest;
import ec.gbc.house.diagram.models.PostDiagramSaveRequest;
import ec.gbc.house.diagram.models.PostDiagramSaveResponse;
import ec.gbc.house.diagram.service.DiagramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;

@RestController
public class DiagramController {

	@Autowired
	DiagramService servicio;

	@PostMapping(value = "/", produces = MediaType.APPLICATION_JSON)
	@ResponseStatus(HttpStatus.CREATED)
	public PostDiagramSaveResponse save(@RequestBody PostDiagramSaveRequest request){
		return servicio.save(request);
	}

	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON)
	@ResponseStatus(HttpStatus.OK)
	public GetDiagramFindRequest findById(@PathVariable("name") String id) throws RestException {
		return servicio.findById(id);
	}
}
