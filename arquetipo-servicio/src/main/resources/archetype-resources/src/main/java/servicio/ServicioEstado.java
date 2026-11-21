package ${package}.servicio;

import ${package}.dto.RespuestaEstado;
import org.springframework.stereotype.Service;

@Service
public class ServicioEstado {
    public RespuestaEstado consultar() {
        return new RespuestaEstado("Disponible");
    }
}
