package cl.ecoconce.controller;

import cl.ecoconce.dto.UsuarioRequest;
import cl.ecoconce.dto.UsuarioResumenDto;
import cl.ecoconce.entity.Comuna;
import cl.ecoconce.entity.Rol;
import cl.ecoconce.entity.Usuario;
import cl.ecoconce.exception.RecursoNoEncontradoException;
import cl.ecoconce.exception.ReglaNegocioException;
import cl.ecoconce.repository.ComunaRepository;
import cl.ecoconce.repository.RolRepository;
import cl.ecoconce.repository.UsuarioRepository;
import cl.ecoconce.service.MapperService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import cl.ecoconce.dto.LoginRequest;
import cl.ecoconce.dto.UsuarioSesionDto;
import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;
    private final ComunaRepository comunaRepository;
    private final RolRepository rolRepository;
    private final MapperService mapper;

    @Transactional(readOnly = true)
    @GetMapping
    public List<UsuarioResumenDto> listar() {
        return usuarioRepository.findAll().stream().map(mapper::toUsuarioResumen).toList();
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public UsuarioResumenDto buscar(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(mapper::toUsuarioResumen)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    @PostMapping
    public UsuarioResumenDto crear(@Valid @RequestBody UsuarioRequest request) {
        if (usuarioRepository.existsByRut(request.rut())) throw new ReglaNegocioException("Ya existe un usuario con ese RUT");
        if (usuarioRepository.existsByCorreo(request.correo())) throw new ReglaNegocioException("Ya existe un usuario con ese correo");
        Comuna comuna = comunaRepository.findById(request.comunaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Comuna no encontrada"));
        Rol rol = rolRepository.findById(request.rolId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Rol no encontrado"));

        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .rut(request.rut())
                .nombreAlias(request.nombreAlias())
                .correo(request.correo())
                .contrasena(request.contrasena())
                .sexoGenero(request.sexoGenero())
                .fechaNacimiento(request.fechaNacimiento())
                .telefono(request.telefono())
                .comuna(comuna)
                .direccion(request.direccion())
                .rol(rol)
                .puntos(0)
                .activo("S")
                .build());
        return mapper.toUsuarioResumen(usuario);
    }
    @PostMapping("/login")
    @Transactional
    public UsuarioSesionDto login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        if (!"S".equalsIgnoreCase(usuario.getActivo())) {
            throw new ReglaNegocioException("Usuario inactivo");
        }

        if (!usuario.getContrasena().equals(request.contrasena())) {
            throw new ReglaNegocioException("Credenciales incorrectas");
        }

        usuario.setFechaUltimoAcceso(LocalDateTime.now());
        Usuario actualizado = usuarioRepository.save(usuario);

        return mapper.toUsuarioSesion(actualizado);
    }

    public UsuarioController(UsuarioRepository usuarioRepository, ComunaRepository comunaRepository, RolRepository rolRepository, MapperService mapper) {
        this.usuarioRepository = usuarioRepository;
        this.comunaRepository = comunaRepository;
        this.rolRepository = rolRepository;
        this.mapper = mapper;
    }
}
