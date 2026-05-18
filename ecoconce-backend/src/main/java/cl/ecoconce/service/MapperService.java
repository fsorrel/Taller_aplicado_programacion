package cl.ecoconce.service;

import cl.ecoconce.dto.*;
import cl.ecoconce.entity.*;
import cl.ecoconce.repository.PuntoMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapperService {
    private final PuntoMaterialRepository puntoMaterialRepository;

    public UsuarioResumenDto toUsuarioResumen(Usuario usuario) {
        return new UsuarioResumenDto(
                usuario.getId(),
                usuario.getNombreAlias(),
                usuario.getCorreo(),
                usuario.getPuntos(),
                usuario.getRol().getNombre()
        );
    }

    public MaterialDto toMaterial(Material material) {
        return new MaterialDto(
                material.getId(),
                material.getNombre(),
                material.getCodigoIdentificador(),
                material.getDescripcion()
        );
    }

    public PuntoReciclajeDto toPunto(PuntoReciclaje punto) {
        List<String> materiales = puntoMaterialRepository.findByPuntoId(punto.getId()).stream()
                .map(pm -> pm.getMaterial().getNombre())
                .toList();
        return new PuntoReciclajeDto(
                punto.getId(),
                punto.getNombre(),
                punto.getDescripcion(),
                punto.getComuna().getNombre(),
                punto.getDireccion(),
                punto.getLatitud(),
                punto.getLongitud(),
                punto.getRadioValidacionM(),
                punto.getEstado().getNombre(),
                materiales
        );
    }

    public GuiaDto toGuia(GuiaReciclaje guia) {
        return new GuiaDto(
                guia.getId(),
                guia.getTitulo(),
                guia.getDescripcion(),
                guia.getContenido(),
                guia.getMaterial() == null ? null : guia.getMaterial().getNombre()
        );
    }

    public PremioDto toPremio(Premio premio) {
        return new PremioDto(
                premio.getId(),
                premio.getNombre(),
                premio.getDescripcion(),
                premio.getCostoPuntos(),
                premio.getStock(),
                premio.getActivo()
        );
    }

    public FormularioResponse toFormulario(FormularioReciclaje formulario) {
        return new FormularioResponse(
                formulario.getId(),
                formulario.getUsuario().getId(),
                formulario.getPunto().getNombre(),
                formulario.getDistanciaMetros(),
                formulario.getTotalPuntosObtenidos(),
                formulario.getEstado(),
                formulario.getFechaFormulario()
        );
    }

    public ReporteResponse toReporte(ReportePunto reporte) {
        return new ReporteResponse(
                reporte.getId(),
                reporte.getUsuario().getNombreAlias(),
                reporte.getPunto().getNombre(),
                reporte.getTipoReporte().getNombre(),
                reporte.getDescripcion(),
                reporte.getFechaReporte()
        );
    }


    public MapperService(PuntoMaterialRepository puntoMaterialRepository) {
        this.puntoMaterialRepository = puntoMaterialRepository;
    }
    public UsuarioAdminDto toUsuarioAdminDto(Usuario usuario) {
    boolean protegido = usuario.getCorreo() != null
            && usuario.getCorreo().equalsIgnoreCase("admin@ecoconce.cl");

    return new UsuarioAdminDto(
            usuario.getId(),
            usuario.getRut(),
            usuario.getNombreAlias(),
            usuario.getCorreo(),
            usuario.getSexoGenero(),
            usuario.getFechaNacimiento(),
            usuario.getTelefono(),
            usuario.getComuna() == null ? null : usuario.getComuna().getId(),
            usuario.getComuna() == null ? null : usuario.getComuna().getNombre(),
            usuario.getDireccion(),
            usuario.getPuntos(),
            usuario.getRol() == null ? null : usuario.getRol().getId(),
            usuario.getRol() == null ? null : usuario.getRol().getNombre(),
            usuario.getActivo(),
            usuario.getFechaRegistro(),
            usuario.getFechaUltimoAcceso(),
            protegido
    );
}
}
