package cl.ecoconce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "premios")
public class Premio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Lob
    @Column(nullable = false)
    private String descripcion;

    @Column(name = "costo_puntos", nullable = false)
    private Integer costoPuntos;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, length = 1)
    private String activo;

    @PrePersist
    void prePersist() {
        if (stock == null) stock = 0;
        if (activo == null) activo = "S";
    }


    public Premio() {
    }

    public Premio(Long id, String nombre, String descripcion, Integer costoPuntos, Integer stock, String activo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costoPuntos = costoPuntos;
        this.stock = stock;
        this.activo = activo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCostoPuntos() {
        return costoPuntos;
    }

    public void setCostoPuntos(Integer costoPuntos) {
        this.costoPuntos = costoPuntos;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getActivo() {
        return activo;
    }

    public void setActivo(String activo) {
        this.activo = activo;
    }

    public static PremioBuilder builder() {
        return new PremioBuilder();
    }

    public static class PremioBuilder {
        private Long id;
        private String nombre;
    private String descripcion;
        private Integer costoPuntos;
        private Integer stock;
        private String activo;

        public PremioBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PremioBuilder nombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public PremioBuilder descripcion(String descripcion) {
            this.descripcion = descripcion;
            return this;
        }

        public PremioBuilder costoPuntos(Integer costoPuntos) {
            this.costoPuntos = costoPuntos;
            return this;
        }

        public PremioBuilder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public PremioBuilder activo(String activo) {
            this.activo = activo;
            return this;
        }

        public Premio build() {
            return new Premio(id, nombre, descripcion, costoPuntos, stock, activo);
        }
    }
}
