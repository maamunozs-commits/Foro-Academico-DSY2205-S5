package cl.matiasmunoz.moderacion;

import cl.matiasmunoz.comun.DatosModeracion.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderacion/temas")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class ControladorModeracion {
    private final ClienteForo foro;

    public ControladorModeracion(ClienteForo foro) {
        this.foro = foro;
    }

    @GetMapping
    public List<Contenido> temas(@RequestParam(defaultValue = "0") int pagina, @AuthenticationPrincipal Jwt sesion) {
        return foro.temas(pagina, sesion);
    }

    @GetMapping("/{temaId}/comentarios")
    public List<Contenido> comentarios(@PathVariable Long temaId, @AuthenticationPrincipal Jwt sesion) {
        return foro.comentarios(temaId, sesion);
    }

    @PutMapping("/{id}")
    public Resultado tema(@PathVariable Long id, @Valid @RequestBody Solicitud cambio,
                          @AuthenticationPrincipal Jwt sesion) {
        return foro.tema(id, cambio, sesion);
    }

    @PutMapping("/{temaId}/comentarios/{id}")
    public Resultado comentario(@PathVariable Long temaId, @PathVariable Long id,
                                 @Valid @RequestBody Solicitud cambio, @AuthenticationPrincipal Jwt sesion) {
        return foro.comentario(temaId, id, cambio, sesion);
    }
}
