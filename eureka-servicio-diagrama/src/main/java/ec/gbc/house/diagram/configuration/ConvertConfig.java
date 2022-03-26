package ec.gbc.house.diagram.configuration;

import ec.gbc.house.diagram.converter.ZonedDateTimeReadConverter;
import ec.gbc.house.diagram.converter.ZonedDateTimeWriteConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.List;

@Configuration
public class ConvertConfig {
    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(new ZonedDateTimeReadConverter(), new ZonedDateTimeWriteConverter()));
    }
}
