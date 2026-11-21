package cl.matiasmunoz.moderacion;

import cl.matiasmunoz.comun.DatosModeracion.*;
import cl.matiasmunoz.comun.ExcepcionNegocio;
import java.time.Duration;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Service
public class ClienteForo {
    private static final String TEMAS = "/api/interno/moderacion/temas";
    private static final ParameterizedTypeReference<List<Contenido>> LISTADO = new ParameterizedTypeReference<>() {};
    private final RestClient foro;

    public ClienteForo(RestClient.Builder cliente, @Value("${foro.url}") String url) {
        var http = java.net.http.HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(4)).build();
        var fabrica = new JdkClientHttpRequestFactory(http);
        fabrica.setReadTimeout(Duration.ofSeconds(8));
        this.foro = cliente.baseUrl(url).requestFactory(fabrica).build();
    }

    public List<Contenido> temas(int pagina, Jwt rol) {
        return solicitar(() -> foro.get().uri(TEMAS + "?pagina={pagina}", pagina)
                .headers(h -> h.setBearerAuth(rol.getTokenValue())).retrieve().body(LISTADO));
    }

    public List<Contenido> comentarios(Long temaId, Jwt rol) {
        return solicitar(() -> foro.get().uri(TEMAS + "/{temaId}/comentarios", temaId)
                .headers(h -> h.setBearerAuth(rol.getTokenValue())).retrieve().body(LISTADO));
    }

    public Resultado tema(Long id, Solicitud cambio, Jwt rol) {
        return actualizar(TEMAS + "/{id}", cambio, rol, id);
    }

    public Resultado comentario(Long temaId, Long id, Solicitud cambio, Jwt rol) {
        return actualizar(TEMAS + "/{temaId}/comentarios/{id}", cambio, rol, temaId, id);
    }

    private Resultado actualizar(String ruta, Solicitud cambio, Jwt rol, Object... ids) {
        return solicitar(() -> foro.put().uri(ruta, ids)
                .headers(h -> h.setBearerAuth(rol.getTokenValue()))
                .body(cambio).retrieve().body(Resultado.class));
    }

    private <T> T solicitar(java.util.function.Supplier<T> llamada) {
        try {
            return llamada.get();
        } catch (RestClientResponseException error) {
            if (error.getStatusCode().is4xxClientError()) {
                throw new ExcepcionNegocio(HttpStatus.valueOf(error.getStatusCode().value()),
                        "El foro rechazó la operación de moderación");
            }
            throw new ExcepcionNegocio(HttpStatus.BAD_GATEWAY, "El servicio de foro no pudo completar la operación");
        } catch (ResourceAccessException error) {
            throw new ExcepcionNegocio(HttpStatus.BAD_GATEWAY, "El servicio de foro no está disponible");
        }
    }
}
