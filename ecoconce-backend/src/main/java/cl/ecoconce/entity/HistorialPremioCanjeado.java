package cl.ecoconce.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_premios_canjeados")
public class HistorialPremioCanjeado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "premio_id")
    private Premio premio;

    @Column(name = "nombre_premio", nullable = false, length = 120)
    private String nombrePremio;

    @Column(name = "puntos_gastados", nullable = false)
    private Integer puntosGastados;

    @Column(name = "codigo_canje", unique = true, length = 80)
    private String codigoCanje;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "fecha_canje")
    private LocalDateTime fechaCanje;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Lob
    private String observacion;

    @PrePersist
    void prePersist() {
        if (estado == null) estado = "PENDIENTE";
        if (fechaCanje == null) fechaCanje = LocalDateTime.now();
    }


    public HistorialPremioCanjeado() {
    }

    public HistorialPremioCanjeado(Long id, Usuario usuario, Premio premio, String nombrePremio, Integer puntosGastados, String codigoCanje, String estado, LocalDateTime fechaCanje, LocalDateTime fechaEntrega, String observacion) {
        this.id = id;
        this.usuario = usuario;
        this.premio = premio;
        this.nombrePremio = nombrePremio;
        this.puntosGastados = puntosGastados;
        this.codigoCanje = codigoCanje;
        this.estado = estado;
        this.fechaCanje = fechaCanje;
        this.fechaEntrega = fechaEntrega;
        this.observacion = observacion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Premio getPremio() {
        return premio;
    }

    public void setPremio(Premio premio) {
        this.premio = premio;
    }

    public String getNombrePremio() {
        return nombrePremio;
    }

    public void setNombrePremio(String nombrePremio) {
        this.nombrePremio = nombrePremio;
    }

    public Integer getPuntosGastados() {
        return puntosGastados;
    }

    public void setPuntosGastados(Integer puntosGastados) {
        this.puntosGastados = puntosGastados;
    }

    public String getCodigoCanje() {
        return codigoCanje;
    }

    public void setCodigoCanje(String codigoCanje) {
        this.codigoCanje = codigoCanje;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCanje() {
        return fechaCanje;
    }

    public void setFechaCanje(LocalDateTime fechaCanje) {
        this.fechaCanje = fechaCanje;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public static HistorialPremioCanjeadoBuilder builder() {
        return new HistorialPremioCanjeadoBuilder();
    }

    public static class HistorialPremioCanjeadoBuilder {
        private Long id;
        private Usuario usuario;
        private Premio premio;
        private String nombrePremio;
        private Integer puntosGastados;
        private String codigoCanje;
        private String estado;
        private LocalDateTime fechaCanje;
        private LocalDateTime fechaEntrega;
    private String observacion;

        public HistorialPremioCanjeadoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public HistorialPremioCanjeadoBuilder usuario(Usuario usuario) {
            this.usuario = usuario;
            return this;
        }

        public HistorialPremioCanjeadoBuilder premio(Premio premio) {
            this.premio = premio;
            return this;
        }

        public HistorialPremioCanjeadoBuilder nombrePremio(String nombrePremio) {
            this.nombrePremio = nombrePremio;
            return this;
        }

        public HistorialPremioCanjeadoBuilder puntosGastados(Integer puntosGastados) {
            this.puntosGastados = puntosGastados;
            return this;
        }

        public HistorialPremioCanjeadoBuilder codigoCanje(String codigoCanje) {
            this.codigoCanje = codigoCanje;
            return this;
        }

        public HistorialPremioCanjeadoBuilder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public HistorialPremioCanjeadoBuilder fechaCanje(LocalDateTime fechaCanje) {
            this.fechaCanje = fechaCanje;
            return this;
        }

        public HistorialPremioCanjeadoBuilder fechaEntrega(LocalDateTime fechaEntrega) {
            this.fechaEntrega = fechaEntrega;
            return this;
        }

        public HistorialPremioCanjeadoBuilder observacion(String observacion) {
            this.observacion = observacion;
            return this;
        }

        public HistorialPremioCanjeado build() {
            return new HistorialPremioCanjeado(id, usuario, premio, nombrePremio, puntosGastados, codigoCanje, estado, fechaCanje, fechaEntrega, observacion);
        }
    }
}
