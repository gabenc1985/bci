package ec.gbc.house.diagram;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableDiscoveryClient
@EnableSwagger2
public class EurekaDiagramApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaDiagramApplication.class, args);
	}
	
	@Bean
    public Docket swaggerApi() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
                .apis(RequestHandlerSelectors.basePackage("ec.gbc.house.diagram.controller"))
                .paths(PathSelectors.any())
            .build()
            .apiInfo(new ApiInfoBuilder().version("1.0").title("Diagrama API").description("Documentation Diagrama API v1.0").build());
    }

}
