package cl.ecoconce.dto;

import java.time.LocalDateTime;

public record CanjeResponse(
        Long id,
        String premio,
        Integer puntosGastados,
        String codigoCanje,
        String estado,
        Integer puntosRestantes,
        LocalDateTime fechaCanje
) {}
