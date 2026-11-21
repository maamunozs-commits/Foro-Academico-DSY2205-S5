package ${package}.controlador;

import ${package}.dto.RespuestaEstado;
import ${package}.servicio.ServicioEstado;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorEstado {
    private final ServicioEstado servicio;

    public ControladorEstado(ServicioEstado servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/api/estado")
    public RespuestaEstado consultarEstado() {
        return servicio.consultar();
    }
}
