package cl.ecoconce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FormularioMaterialRequest(
        @NotNull Long materialId,
        @NotNull @Positive Double cantidadDeclarada,
        String unidadDeclarada,
        String observacion
) {}
