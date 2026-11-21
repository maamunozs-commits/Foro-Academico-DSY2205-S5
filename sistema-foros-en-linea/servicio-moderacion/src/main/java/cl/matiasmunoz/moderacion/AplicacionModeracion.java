package cl.matiasmunoz.moderacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"cl.matiasmunoz.moderacion", "cl.matiasmunoz.comun"})
public class AplicacionModeracion {
    public static void main(String[] args) {
        SpringApplication.run(AplicacionModeracion.class, args);
    }
}
