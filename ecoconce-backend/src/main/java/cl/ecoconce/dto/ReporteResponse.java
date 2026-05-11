package cl.ecoconce.dto;

import java.time.LocalDateTime;

public record ReporteResponse(
        Long id,
        String usuario,
        String punto,
        String tipoReporte,
        String descripcion,
        LocalDateTime fechaReporte
) {}
