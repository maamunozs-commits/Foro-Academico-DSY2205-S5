package cl.matiasmunoz.foro.servicio;

import cl.matiasmunoz.comun.DatosModeracion.*;
import cl.matiasmunoz.comun.ExcepcionNegocio;
import cl.matiasmunoz.foro.modelo.DecisionModeracion;
import cl.matiasmunoz.foro.repositorio.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GestionVisibilidad {
    private final RepositorioTemas temas;
    private final RepositorioComentarios comentarios;
    private final RepositorioModeracion decisiones;

    public GestionVisibilidad(RepositorioTemas temas, RepositorioComentarios comentarios,
                              RepositorioModeracion decisiones) {
        this.temas = temas;
        this.comentarios = comentarios;
        this.decisiones = decisiones;
    }

    @Transactional(readOnly = true)
    public List<Contenido> temas(int pagina) {
        if (pagina < 0) {
            throw new ExcepcionNegocio(HttpStatus.BAD_REQUEST, "La página no puede ser negativa");
        }
        return temas.findAll(PageRequest.of(pagina, 25, Sort.by(Sort.Direction.DESC, "id")))
                .map(t -> new Contenido(t.getId(), null, t.getTitulo(), t.getAutorNombre(), t.isOculto()))
                .getContent();
    }

    @Transactional(readOnly = true)
    public List<Contenido> comentarios(Long temaId) {
        if (!temas.existsById(temaId)) {
            throw new ExcepcionNegocio(HttpStatus.NOT_FOUND, "El tema no existe");
        }
        return comentarios.listarPorTema(temaId).stream()
                .map(c -> new Contenido(c.getId(), temaId, c.getContenido(), c.getAutorNombre(), c.isOculto()))
                .toList();
    }

    public Resultado cambiarTema(Long id, Solicitud cambio, Jwt identidad) {
        var tema = temas.findById(id)
                .orElseThrow(() -> new ExcepcionNegocio(HttpStatus.NOT_FOUND, "El tema no existe"));
        tema.setOculto(cambio.oculto());
        return registrar("TEMA", id, cambio, identidad);
    }

    public Resultado cambiarComentario(Long temaId, Long id, Solicitud cambio, Jwt identidad) {
        var comentario = comentarios.findById(id).filter(c -> c.getTema().getId().equals(temaId))
                .orElseThrow(() -> new ExcepcionNegocio(HttpStatus.NOT_FOUND, "El comentario no existe"));
        comentario.setOculto(cambio.oculto());
        return registrar("COMENTARIO", id, cambio, identidad);
    }

    private Resultado registrar(String tipo, Long id, Solicitud cambio, Jwt identidad) {
        return decisiones.save(new DecisionModeracion(tipo, id, cambio.oculto(), cambio.motivo().strip(),
                Long.valueOf(identidad.getSubject()), LocalDateTime.now(ZoneOffset.UTC))).resultado();
    }
}
