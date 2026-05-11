package cl.ecoconce.repository;

import cl.ecoconce.entity.PuntoMaterial;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PuntoMaterialRepository extends JpaRepository<PuntoMaterial, Long> {
    @Override
    @EntityGraph(attributePaths = {"punto", "material"})
    List<PuntoMaterial> findAll();

    @EntityGraph(attributePaths = {"punto", "material"})
    List<PuntoMaterial> findByPuntoId(Long puntoId);
}
