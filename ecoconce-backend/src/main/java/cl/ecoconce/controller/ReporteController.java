package cl.ecoconce.controller;

import cl.ecoconce.dto.ReporteRequest;
import cl.ecoconce.dto.ReporteResponse;
import cl.ecoconce.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {
    private final ReporteService reporteService;

    @PostMapping
    public ReporteResponse crear(@Valid @RequestBody ReporteRequest request) {
        return reporteService.crear(request);
    }


    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }
}
