package cl.ecoconce.controller;

import cl.ecoconce.dto.CanjeResponse;
import cl.ecoconce.dto.PremioDto;
import cl.ecoconce.repository.PremioRepository;
import cl.ecoconce.service.CanjeService;
import cl.ecoconce.service.MapperService;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/premios")
public class PremioController {
    private final PremioRepository premioRepository;
    private final MapperService mapper;
    private final CanjeService canjeService;

    @Transactional(readOnly = true)
    @GetMapping
    public List<PremioDto> listar() {
        return premioRepository.findByActivo("S").stream().map(mapper::toPremio).toList();
    }

    @PostMapping("/{premioId}/canjear")
    public CanjeResponse canjear(@PathVariable Long premioId, @RequestParam Long usuarioId) {
        return canjeService.canjear(usuarioId, premioId);
    }


    public PremioController(PremioRepository premioRepository, MapperService mapper, CanjeService canjeService) {
        this.premioRepository = premioRepository;
        this.mapper = mapper;
        this.canjeService = canjeService;
    }
}
