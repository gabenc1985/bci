package ec.gob.house.eurekaserver.eurekabci;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaBciApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaBciApplication.class, args);
	}

}
