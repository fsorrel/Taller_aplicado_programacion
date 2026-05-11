package cl.ecoconce.controller;

import cl.ecoconce.dto.PuntoReciclajeDto;
import cl.ecoconce.exception.RecursoNoEncontradoException;
import cl.ecoconce.repository.PuntoReciclajeRepository;
import cl.ecoconce.service.MapperService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional(readOnly = true)
@RequestMapping("/api/puntos")
public class PuntoReciclajeController {
    private final PuntoReciclajeRepository puntoRepository;
    private final MapperService mapper;

    @GetMapping
    public List<PuntoReciclajeDto> listar() {
        return puntoRepository.findAll().stream().map(mapper::toPunto).toList();
    }

    @GetMapping("/{id}")
    public PuntoReciclajeDto buscar(@PathVariable Long id) {
        return puntoRepository.findById(id)
                .map(mapper::toPunto)
                .orElseThrow(() -> new RecursoNoEncontradoException("Punto de reciclaje no encontrado"));
    }


    public PuntoReciclajeController(PuntoReciclajeRepository puntoRepository, MapperService mapper) {
        this.puntoRepository = puntoRepository;
        this.mapper = mapper;
    }
}
