package cl.ecoconce.service;

import cl.ecoconce.dto.CanjeResponse;
import cl.ecoconce.entity.HistorialPremioCanjeado;
import cl.ecoconce.entity.MovimientoPuntosUsuario;
import cl.ecoconce.entity.Premio;
import cl.ecoconce.entity.Usuario;
import cl.ecoconce.exception.RecursoNoEncontradoException;
import cl.ecoconce.exception.ReglaNegocioException;
import cl.ecoconce.repository.HistorialPremioCanjeadoRepository;
import cl.ecoconce.repository.MovimientoPuntosUsuarioRepository;
import cl.ecoconce.repository.PremioRepository;
import cl.ecoconce.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CanjeService {
    private final UsuarioRepository usuarioRepository;
    private final PremioRepository premioRepository;
    private final HistorialPremioCanjeadoRepository canjeRepository;
    private final MovimientoPuntosUsuarioRepository movimientoRepository;

    @Transactional
    public CanjeResponse canjear(Long usuarioId, Long premioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        Premio premio = premioRepository.findById(premioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Premio no encontrado"));

        if (!"S".equals(premio.getActivo())) throw new ReglaNegocioException("El premio no está activo");
        if (premio.getStock() <= 0) throw new ReglaNegocioException("El premio no tiene stock");
        if (usuario.getPuntos() < premio.getCostoPuntos()) throw new ReglaNegocioException("El usuario no tiene puntos suficientes");

        usuario.setPuntos(usuario.getPuntos() - premio.getCostoPuntos());
        premio.setStock(premio.getStock() - 1);
        usuarioRepository.save(usuario);
        premioRepository.save(premio);

        HistorialPremioCanjeado canje = canjeRepository.save(HistorialPremioCanjeado.builder()
                .usuario(usuario)
                .premio(premio)
                .nombrePremio(premio.getNombre())
                .puntosGastados(premio.getCostoPuntos())
                .codigoCanje("ECO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .estado("PENDIENTE")
                .observacion("Canje generado desde la aplicación")
                .build());

        movimientoRepository.save(MovimientoPuntosUsuario.builder()
                .usuario(usuario)
                .tipoMovimiento("CANJE")
                .puntos(premio.getCostoPuntos())
                .canje(canje)
                .descripcion("Canje de premio: " + premio.getNombre())
                .build());

        return new CanjeResponse(
                canje.getId(),
                canje.getNombrePremio(),
                canje.getPuntosGastados(),
                canje.getCodigoCanje(),
                canje.getEstado(),
                usuario.getPuntos(),
                canje.getFechaCanje()
        );
    }


    public CanjeService(UsuarioRepository usuarioRepository, PremioRepository premioRepository, HistorialPremioCanjeadoRepository canjeRepository, MovimientoPuntosUsuarioRepository movimientoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.premioRepository = premioRepository;
        this.canjeRepository = canjeRepository;
        this.movimientoRepository = movimientoRepository;
    }
}
