package cl.ecoconce.dto;

import java.util.List;

public record PuntoReciclajeDto(
        Long id,
        String nombre,
        String descripcion,
        String comuna,
        String direccion,
        Double latitud,
        Double longitud,
        Integer radioValidacionM,
        String estado,
        List<String> materiales
) {}
