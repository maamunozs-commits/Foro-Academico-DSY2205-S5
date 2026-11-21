package cl.matiasmunoz.foro.controlador;

import cl.matiasmunoz.comun.DatosModeracion.*;
import cl.matiasmunoz.foro.servicio.GestionVisibilidad;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interno/moderacion/temas")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class ControladorVisibilidad {
    private final GestionVisibilidad gestion;

    public ControladorVisibilidad(GestionVisibilidad gestion) {
        this.gestion = gestion;
    }

    @GetMapping
    public List<Contenido> temas(@RequestParam(defaultValue = "0") int pagina) {
        return gestion.temas(pagina);
    }

    @GetMapping("/{temaId}/comentarios")
    public List<Contenido> comentarios(@PathVariable Long temaId) {
        return gestion.comentarios(temaId);
    }

    @PutMapping("/{id}")
    public Resultado tema(@PathVariable Long id, @Valid @RequestBody Solicitud cambio,
                          @AuthenticationPrincipal Jwt identidad) {
        return gestion.cambiarTema(id, cambio, identidad);
    }

    @PutMapping("/{temaId}/comentarios/{id}")
    public Resultado comentario(@PathVariable Long temaId, @PathVariable Long id,
                                 @Valid @RequestBody Solicitud cambio, @AuthenticationPrincipal Jwt identidad) {
        return gestion.cambiarComentario(temaId, id, cambio, identidad);
    }
}
