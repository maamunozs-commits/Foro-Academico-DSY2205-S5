package cl.matiasmunoz.foro.modelo;

import cl.matiasmunoz.comun.DatosModeracion.Resultado;
import jakarta.persistence.*;
import org.hibernate.type.NumericBooleanConverter;
import java.time.LocalDateTime;

@Entity
@Table(name = "decisiones_moderacion")
public class DecisionModeracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 12)
    private String tipo;

    @Column(name = "contenido_id", nullable = false)
    private Long contenidoId;

    @Convert(converter = NumericBooleanConverter.class)
    @Column(name = "oculto", nullable = false)
    private boolean oculto;

    @Column(nullable = false, length = 300)
    private String motivo;

    @Column(name = "administrador_id", nullable = false)
    private Long administradorId;

    @Column(nullable = false)
    private LocalDateTime fecha;

    protected DecisionModeracion() {}

    public DecisionModeracion(String tipo, Long contenidoId, boolean oculto,
                             String motivo, Long administradorId, LocalDateTime fecha) {
        this.tipo = tipo;
        this.contenidoId = contenidoId;
        this.oculto = oculto;
        this.motivo = motivo;
        this.administradorId = administradorId;
        this.fecha = fecha;
    }

    public Resultado resultado() {
        return new Resultado(contenidoId, oculto, motivo, administradorId, fecha);
    }
}
