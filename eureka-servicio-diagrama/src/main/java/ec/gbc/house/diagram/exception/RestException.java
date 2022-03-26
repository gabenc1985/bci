package ec.gbc.house.diagram.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class RestException extends Exception{

    private HttpStatus httpStatus;

    private String message;

    public RestException(HttpStatus httpStatus, String message) {
        super(message);
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
