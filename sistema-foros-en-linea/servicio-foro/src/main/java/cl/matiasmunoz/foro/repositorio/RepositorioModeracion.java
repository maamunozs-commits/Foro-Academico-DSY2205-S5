package cl.matiasmunoz.foro.repositorio;

import cl.matiasmunoz.foro.modelo.DecisionModeracion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioModeracion extends JpaRepository<DecisionModeracion, Long> {}
