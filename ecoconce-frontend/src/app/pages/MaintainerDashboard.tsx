import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, MapPin, RefreshCw, Save, Wrench } from "lucide-react";
import { api, BdRow, getCurrentUser, PuntoReciclaje } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const getRowId = (row: BdRow) => Number(row.id ?? row.ID ?? 0);
const getRowName = (row: BdRow) => String(row.nombre ?? row.NOMBRE ?? row.name ?? row.NAME ?? "");

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
  const [estados, setEstados] = useState<BdRow[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Record<number, number>>({});
  const [descripcion, setDescripcion] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalOperativos = useMemo(() => {
    return puntos.filter((punto) => punto.estado?.toUpperCase().includes("OPERATIVO")).length;
  }, [puntos]);

  const totalAlertas = useMemo(() => {
    return puntos.filter((punto) => {
      const estado = (punto.estado ?? "").toUpperCase();
      return estado.includes("LLENO") || estado.includes("MANTENIMIENTO") || estado.includes("INACTIVO");
    }).length;
  }, [puntos]);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!mantenedorId) {
        throw new Error("No se encontró el mantenedor activo. Inicia sesión nuevamente.");
      }

      const [puntosData, estadosData] = await Promise.all([
        api.puntosMantenedor(mantenedorId),
        api.estadosPunto(),
      ]);

      setPuntos(puntosData);
      setEstados(estadosData);

      const estadosIniciales: Record<number, number> = {};
      const descripcionesIniciales: Record<number, string> = {};

      puntosData.forEach((punto) => {
        estadosIniciales[punto.id] = punto.estadoId ?? 1;
        descripcionesIniciales[punto.id] = "";
      });

      setEstadoSeleccionado(estadosIniciales);
      setDescripcion(descripcionesIniciales);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los puntos del mantenedor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const actualizarEstado = async (punto: PuntoReciclaje) => {
    const nuevoEstadoId = estadoSeleccionado[punto.id];

    if (!nuevoEstadoId) {
      setError("Debes seleccionar un estado válido.");
      return;
    }

    setSavingId(punto.id);
    setError("");
    setSuccess("");

    try {
      await api.actualizarEstadoPuntoMantenedor(mantenedorId, punto.id, {
        estadoId: Number(nuevoEstadoId),
        descripcion: descripcion[punto.id] ?? "",
      });

      setSuccess(`Estado de "${punto.nombre}" actualizado correctamente.`);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el estado del punto");
    } finally {
      setSavingId(null);
    }
  };

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
            Revisa tus puntos asignados y actualiza su estado operativo.
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

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 flex gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
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
            <p className="text-sm text-gray-600">Requieren atención</p>
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
          {puntos.map((punto) => (
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
                    <p className="text-gray-500">Latitud</p>
                    <p className="font-medium text-[#2d4437]">{punto.latitud}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Longitud</p>
                    <p className="font-medium text-[#2d4437]">{punto.longitud}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Materiales aceptados</p>
                  <div className="flex flex-wrap gap-2">
                    {punto.materiales.length > 0 ? (
                      punto.materiales.map((material, index) => (
                        <Badge
                          key={`${punto.id}-${material}-${index}`}
                          variant="outline"
                          className="border-[#6fae7f]"
                        >
                          {material}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Sin materiales asociados</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Nuevo estado</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={estadoSeleccionado[punto.id] ?? punto.estadoId ?? ""}
                      onChange={(e) =>
                        setEstadoSeleccionado({
                          ...estadoSeleccionado,
                          [punto.id]: Number(e.target.value),
                        })
                      }
                    >
                      {estados.map((estado) => (
                        <option key={getRowId(estado)} value={getRowId(estado)}>
                          {getRowName(estado)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Observación</Label>
                    <Textarea
                      value={descripcion[punto.id] ?? ""}
                      onChange={(e) =>
                        setDescripcion({
                          ...descripcion,
                          [punto.id]: e.target.value,
                        })
                      }
                      placeholder="Ej: Contenedor lleno, punto limpiado, requiere retiro..."
                    />
                  </div>

                  <Button
                    onClick={() => actualizarEstado(punto)}
                    disabled={savingId === punto.id}
                    className="w-full bg-[#3d5a47] hover:bg-[#2d4437]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingId === punto.id ? "Guardando..." : "Actualizar estado"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}