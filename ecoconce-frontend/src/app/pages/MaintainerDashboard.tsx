import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  CheckCircle,
  MapPin,
  RefreshCw,
  Wrench,
  ArrowRight,
  Package,
} from "lucide-react";
import { api, getCurrentUser, PuntoReciclaje } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const estadoColor = (estado: string) => {
  const normalizado = estado?.toUpperCase();

  if (normalizado.includes("INACTIVO")) {
    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  if (normalizado.includes("OPERATIVO") || normalizado.includes("ACTIVO")) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (normalizado.includes("LLENO") || normalizado.includes("COLAPSADO")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (normalizado.includes("MANTENIMIENTO")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return "bg-blue-100 text-blue-700 border-blue-200";
};

export function MaintainerDashboard() {
  const usuario = getCurrentUser();
  const mantenedorId = usuario?.id ?? 0;

  const [puntos, setPuntos] = useState<PuntoReciclaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalOperativos = useMemo(() => {
    return puntos.filter((punto) => punto.estado?.toUpperCase().includes("OPERATIVO")).length;
  }, [puntos]);

  const totalAlertas = useMemo(() => {
    return puntos.filter((punto) => {
      const estado = (punto.estado ?? "").toUpperCase();
      return (
        estado.includes("LLENO") ||
        estado.includes("MANTENIMIENTO") ||
        estado.includes("INACTIVO")
      );
    }).length;
  }, [puntos]);

  const totalMaterialesLlenos = useMemo(() => {
    return puntos.reduce((total, punto) => {
      return total + (punto.materialesDetalle ?? []).filter((material) => material.lleno).length;
    }, 0);
  }, [puntos]);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!mantenedorId) {
        throw new Error("No se encontró el mantenedor activo. Inicia sesión nuevamente.");
      }

      const puntosData = await api.puntosMantenedor(mantenedorId);
      setPuntos(puntosData);
      setSuccess("Puntos actualizados correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los puntos del mantenedor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-[#3d5a47]" />
            <h1 className="text-3xl font-bold text-[#2d4437]">
              Panel del Mantenedor
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Revisa los puntos de reciclaje que tienes asignados y entra al detalle para gestionarlos.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={cargarDatos}
          disabled={loading}
          className="border-[#3d5a47] text-[#3d5a47]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 flex gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-[#2d4437] mb-1">{puntos.length}</p>
            <p className="text-sm text-gray-600">Puntos asignados</p>
          </CardContent>
        </Card>

        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">{totalOperativos}</p>
            <p className="text-sm text-gray-600">Operativos</p>
          </CardContent>
        </Card>

        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-yellow-600 mb-1">{totalAlertas}</p>
            <p className="text-sm text-gray-600">Puntos con alerta</p>
          </CardContent>
        </Card>

        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600 mb-1">{totalMaterialesLlenos}</p>
            <p className="text-sm text-gray-600">Materiales llenos</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Cargando puntos asignados...
          </CardContent>
        </Card>
      ) : puntos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No tienes puntos asignados
            </h3>
            <p className="text-gray-500">
              Un administrador debe asignarte puntos de reciclaje para que puedas gestionarlos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid xl:grid-cols-2 gap-6">
          {puntos.map((punto) => {
            const materialesLlenos = (punto.materialesDetalle ?? []).filter((material) => material.lleno);
            const materialesDisponibles = (punto.materialesDetalle ?? []).filter((material) => material.disponible);

            return (
              <Card key={punto.id} className="border-[#6fae7f]/20 hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-[#2d4437]">{punto.nombre}</CardTitle>
                      <CardDescription className="mt-1">
                        {punto.direccion}
                      </CardDescription>
                    </div>

                    <Badge className={estadoColor(punto.estado)}>
                      {punto.estado}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Comuna</p>
                      <p className="font-medium text-[#2d4437]">{punto.comuna}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Radio validación</p>
                      <p className="font-medium text-[#2d4437]">{punto.radioValidacionM} m</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Materiales disponibles</p>
                      <p className="font-medium text-green-700">{materialesDisponibles.length}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Materiales llenos</p>
                      <p className="font-medium text-red-700">{materialesLlenos.length}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#3d5a47]" />
                      <p className="text-sm font-medium text-[#2d4437]">
                        Resumen de materiales
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(punto.materialesDetalle ?? []).length > 0 ? (
                        punto.materialesDetalle.map((material) => (
                          <Badge
                            key={`${punto.id}-${material.materialId}`}
                            variant="outline"
                            className={
                              material.lleno
                                ? "border-red-200 text-red-700 bg-red-50"
                                : "border-green-200 text-green-700 bg-green-50"
                            }
                          >
                            {material.nombre}: {material.lleno ? "Lleno" : "Disponible"}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          Sin materiales asociados.
                        </p>
                      )}
                    </div>
                  </div>

                  <Link to={`/mantenedor/puntos/${punto.id}`}>
                    <Button className="w-full bg-[#3d5a47] hover:bg-[#2d4437]">
                      Gestionar punto
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}