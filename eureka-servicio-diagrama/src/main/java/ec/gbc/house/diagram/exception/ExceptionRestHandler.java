package ec.gbc.house.diagram.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class ExceptionRestHandler {


        @org.springframework.web.bind.annotation.ExceptionHandler(RestException.class)
        public ResponseEntity handleException(RestException e) {
            // log exception
            return ResponseEntity
                    .status(e.getHttpStatus())
                    .body("No content");
        }

}
