import { useEffect, useMemo, useState } from "react";
import { Gift, Loader2, Search, Star, Ticket, Trophy } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { api, getCurrentUser, refreshCurrentUserFromBackend } from "../lib/api";
import type { CanjeResponse, Premio, UsuarioSesion } from "../lib/api";

const formatDate = (value: string) => {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function PremiosCiudadano() {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => getCurrentUser());
  const [premios, setPremios] = useState<Premio[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [canjeandoId, setCanjeandoId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<CanjeResponse | null>(null);

  const cargarPremios = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await api.premios();
      setPremios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los premios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPremios();

    refreshCurrentUserFromBackend()
      .then((updated) => {
        if (updated) setUsuario(updated);
      })
      .catch(() => setUsuario(getCurrentUser()));
  }, []);

  const premiosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return premios;

    return premios.filter((premio) =>
      `${premio.nombre} ${premio.descripcion}`.toLowerCase().includes(term)
    );
  }, [premios, search]);

  const handleCanjear = async (premio: Premio) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      setError("Debes iniciar sesión para canjear premios.");
      return;
    }

    setError("");
    setSuccess(null);
    setCanjeandoId(premio.id);

    try {
      const response = await api.canjearPremio(premio.id, currentUser.id);

      setSuccess(response);
      setUsuario({ ...currentUser, puntos: response.puntosRestantes });

      await cargarPremios();

      const updated = await refreshCurrentUserFromBackend();
      if (updated) setUsuario(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo realizar el canje.");
    } finally {
      setCanjeandoId(null);
    }
  };

  const puntosUsuario = usuario?.puntos ?? 0;
  const premiosDisponibles = premios.filter((premio) => premio.stock > 0).length;

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5] min-h-screen">
      <div className="bg-gradient-to-r from-[#3d5a47] to-[#6fae7f] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Premios y canjes</h1>
              <p className="opacity-90">
                Canjea tus puntos por beneficios disponibles en EcoConce.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="rounded-xl bg-white/15 px-4 py-3">
              <p className="text-sm opacity-80">Tus puntos actuales</p>
              <p className="text-2xl font-bold">
                {puntosUsuario.toLocaleString("es-CL")} pts
              </p>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-3">
              <p className="text-sm opacity-80">Premios con stock</p>
              <p className="text-2xl font-bold">{premiosDisponibles}</p>
            </div>
          </div>
        </div>

        <Gift className="absolute right-8 bottom-4 w-40 h-40 opacity-20" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Canje generado correctamente
                </p>

                <h2 className="text-2xl font-bold text-green-900">
                  {success.premio}
                </h2>

                <p className="text-sm text-green-800 mt-1">
                  Guarda este código:{" "}
                  <span className="font-bold">{success.codigoCanje}</span>
                </p>

                <p className="text-xs text-green-700 mt-1">
                  Fecha: {formatDate(success.fechaCanje)}
                </p>
              </div>

              <Badge className="bg-green-700 text-white text-sm px-4 py-2">
                {success.estado}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2d4437]">
            Catálogo de premios
          </h2>
          <p className="text-gray-600">
            Se muestran los premios disponibles cargados desde el backend.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar premio..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-8 text-center text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Cargando premios disponibles...
          </CardContent>
        </Card>
      ) : premiosFiltrados.length === 0 ? (
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-8 text-center text-gray-600">
            No hay premios disponibles con ese filtro.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {premiosFiltrados.map((premio) => {
            const sinStock = premio.stock <= 0;
            const puntosInsuficientes = puntosUsuario < premio.costoPuntos;
            const disabled = sinStock || puntosInsuficientes || canjeandoId === premio.id;

            return (
              <Card
                key={premio.id}
                className="border-[#6fae7f]/20 hover:shadow-lg transition bg-white"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#3d5a47]">
                      <Gift className="w-6 h-6" />
                    </div>

                    <Badge
                      className={
                        sinStock
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#3d5a47] text-white"
                      }
                    >
                      {sinStock ? "Agotado" : `${premio.stock} disponibles`}
                    </Badge>
                  </div>

                  <CardTitle className="text-[#2d4437] text-xl mt-4">
                    {premio.nombre}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <p className="text-sm text-gray-600 min-h-12">
                    {premio.descripcion}
                  </p>

                  <div className="flex items-center justify-between rounded-xl bg-[#f5f7f5] p-4">
                    <div className="flex items-center gap-2 text-[#2d4437]">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold">
                        {premio.costoPuntos.toLocaleString("es-CL")} pts
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      Costo del canje
                    </span>
                  </div>

                  {puntosInsuficientes && !sinStock && (
                    <p className="text-xs text-red-600">
                      Te faltan{" "}
                      {(premio.costoPuntos - puntosUsuario).toLocaleString("es-CL")}{" "}
                      puntos para canjearlo.
                    </p>
                  )}

                  <Button
                    className="w-full bg-[#3d5a47] hover:bg-[#2d4437]"
                    disabled={disabled}
                    onClick={() => handleCanjear(premio)}
                  >
                    {canjeandoId === premio.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Ticket className="w-4 h-4 mr-2" />
                    )}

                    {sinStock
                      ? "Sin stock"
                      : puntosInsuficientes
                        ? "Puntos insuficientes"
                        : "Canjear premio"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}