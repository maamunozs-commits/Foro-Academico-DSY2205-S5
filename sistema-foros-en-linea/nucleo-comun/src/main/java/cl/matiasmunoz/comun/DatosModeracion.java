package cl.matiasmunoz.comun;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public final class DatosModeracion {
    private DatosModeracion() {}

    public record Solicitud(
            @NotNull Boolean oculto,
            @NotBlank @Size(max = 300) String motivo) {}

    public record Contenido(Long id, Long temaId, String texto, String autor, boolean oculto) {}

    public record Resultado(Long contenidoId, boolean oculto, String motivo, Long administradorId,
                            LocalDateTime fecha) {}
}
