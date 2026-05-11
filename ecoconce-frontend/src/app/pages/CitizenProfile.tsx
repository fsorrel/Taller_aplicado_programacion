import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Mail, MapPin, Award, TrendingUp, Calendar, Edit, Save, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, BdRow, getCurrentUser, refreshCurrentUserFromBackend, saveCurrentUser, UsuarioSesion } from "../lib/api";

const value = (row: BdRow, key: string) => row[key] ?? "";
const numberValue = (row: BdRow, key: string) => Number(row[key] ?? 0) || 0;

const formatDate = (date: string) => {
  if (!date) return "Sin fecha";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
};

const levelInfo = (points: number) => {
  if (points >= 15000) return { label: "Nivel 4: Campeón del Reciclaje", next: 15000, progress: 100, missing: 0 };
  if (points >= 10000) return { label: "Nivel 3: Guardián Ambiental", next: 15000, progress: Math.round((points / 15000) * 100), missing: 15000 - points };
  if (points >= 5000) return { label: "Nivel 2: Recolector Verde", next: 10000, progress: Math.round((points / 10000) * 100), missing: 10000 - points };
  return { label: "Nivel 1: Eco Novato", next: 5000, progress: Math.round((points / 5000) * 100), missing: 5000 - points };
};

const emptyUser: UsuarioSesion = {
  id: 1,
  rut: "",
  nombreAlias: "Usuario EcoConce",
  correo: "",
  sexoGenero: "",
  fechaNacimiento: "",
  telefono: "",
  comunaId: 0,
  comuna: "",
  direccion: "",
  puntos: 0,
  rolId: 2,
  rol: "Ciudadano",
  activo: "S",
  fechaRegistro: "",
  fechaUltimoAcceso: "",
};

export function CitizenProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioSesion>(() => getCurrentUser() ?? emptyUser);
  const [profileData, setProfileData] = useState<UsuarioSesion>(() => getCurrentUser() ?? emptyUser);
  const [formularios, setFormularios] = useState<BdRow[]>([]);
  const [detalles, setDetalles] = useState<BdRow[]>([]);

  useEffect(() => {
    let mounted = true;

    refreshCurrentUserFromBackend()
      .then((updated) => {
        if (!mounted || !updated) return;
        setUsuario(updated);
        setProfileData(updated);
      })
      .catch(() => undefined);

    Promise.all([api.formularios(), api.detalleFormularios()])
      .then(([formulariosData, detallesData]) => {
        if (!mounted) return;
        setFormularios(formulariosData);
        setDetalles(detallesData);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const userForms = useMemo(
    () => formularios.filter((formulario) => Number(value(formulario, "usuario_id")) === usuario.id),
    [formularios, usuario.id]
  );

  const totalMaterialesDeclarados = useMemo(() => {
    const ids = new Set(userForms.map((formulario) => Number(value(formulario, "id"))));
    return detalles
      .filter((detalle) => ids.has(Number(value(detalle, "formulario_id"))))
      .reduce((total, detalle) => total + numberValue(detalle, "cantidad_declarada"), 0);
  }, [detalles, userForms]);

  const puntos = usuario.puntos ?? 0;
  const nivel = levelInfo(puntos);

  const stats = [
    { label: "Materiales declarados", value: totalMaterialesDeclarados.toLocaleString("es-CL"), icon: TrendingUp, color: "text-green-600" },
    { label: "Puntos Totales", value: puntos.toLocaleString("es-CL"), icon: Award, color: "text-yellow-600" },
    { label: "Formularios enviados", value: userForms.length.toLocaleString("es-CL"), icon: ClipboardList, color: "text-blue-600" },
    { label: "Nivel Actual", value: nivel.label.split(":")[0].replace("Nivel ", ""), icon: TrendingUp, color: "text-purple-600" },
  ];

  const medals = [
    { name: "Eco Novato", icon: "🥉", obtained: puntos >= 0, description: "Cuenta creada en EcoConce" },
    { name: "Recolector Verde", icon: "🌱", obtained: puntos >= 5000, description: "Alcanza 5.000 puntos" },
    { name: "Guardián Ambiental", icon: "🏆", obtained: puntos >= 10000, description: "Alcanza 10.000 puntos" },
    { name: "Campeón del Reciclaje", icon: "♻️", obtained: puntos >= 15000, description: "Alcanza 15.000 puntos" },
  ];

  const handleSave = () => {
    const updated = saveCurrentUser(profileData as unknown as Record<string, unknown>);
    setUsuario(updated);
    setProfileData(updated);
    setIsEditing(false);
  };

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2d4437] mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Información cargada desde la cuenta que inició sesión</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-[#3d5a47] hover:bg-[#2d4437]"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar en sesión
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#6fae7f]/20">
              <CardContent className="p-6 text-center">
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <p className="text-3xl font-bold text-[#2d4437] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="history">Formularios</TabsTrigger>
              <TabsTrigger value="progress">Progreso</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card className="border-[#6fae7f]/20">
                <CardHeader>
                  <CardTitle className="text-[#2d4437] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#3d5a47]" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre o Alias</Label>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <Input id="name" value={profileData.nombreAlias} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, nombreAlias: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT</Label>
                      <Input id="rut" value={profileData.rut} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, rut: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input id="fechaNacimiento" type="date" value={profileData.fechaNacimiento} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, fechaNacimiento: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo / Género</Label>
                      <select id="sexo" value={profileData.sexoGenero} onChange={(e) => setProfileData({ ...profileData, sexoGenero: e.target.value })} disabled={!isEditing} className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${!isEditing ? "bg-gray-50" : "bg-white"}`}>
                        <option value="">Sin indicar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Input id="email" type="email" value={profileData.correo} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, correo: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" value={profileData.telefono} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <Input id="address" value={profileData.direccion} disabled={!isEditing} onChange={(e) => setProfileData({ ...profileData, direccion: e.target.value })} className={!isEditing ? "bg-gray-50" : ""} />
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500">
                      Estos cambios actualizan la sesión visual del frontend. La base de datos no se modifica porque no hay endpoint de edición de usuario en el backend actual.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="border-[#6fae7f]/20">
                <CardHeader>
                  <CardTitle className="text-[#2d4437]">Formularios de reciclaje de esta cuenta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userForms.length === 0 && <p className="text-sm text-gray-600">Esta cuenta aún no tiene formularios registrados.</p>}
                    {userForms.map((item) => (
                      <div key={String(value(item, "id"))} className="p-4 bg-[#f5f7f5] rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-[#2d4437]">Formulario #{String(value(item, "id"))}</p>
                            <p className="text-sm text-gray-600">{formatDate(String(value(item, "fecha_formulario")))}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            +{numberValue(item, "total_puntos_obtenidos").toLocaleString("es-CL")} pts
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <Badge variant="outline" className="border-[#6fae7f]">{String(value(item, "estado") || "Pendiente")}</Badge>
                          <span>Punto ID: {String(value(item, "punto_id"))}</span>
                          <span>Distancia: {numberValue(item, "distancia_metros").toLocaleString("es-CL")} m</span>
                        </div>
                        {value(item, "observacion") && <p className="mt-2 text-sm text-gray-600">{String(value(item, "observacion"))}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <Card className="border-[#6fae7f]/20">
                <CardHeader>
                  <CardTitle className="text-[#2d4437]">Progreso de Nivel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[#2d4437]">{nivel.label}</span>
                    <span className="text-sm text-gray-600">{puntos.toLocaleString("es-CL")} / {nivel.next.toLocaleString("es-CL")} pts</span>
                  </div>
                  <Progress value={nivel.progress} className="h-3" />
                  <p className="text-xs text-gray-600">
                    {nivel.missing === 0 ? "Ya alcanzaste el nivel máximo disponible." : `${nivel.missing.toLocaleString("es-CL")} puntos para el siguiente nivel.`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="border-[#6fae7f]/20">
            <CardContent className="p-6 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#6fae7f] to-[#3d5a47] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-bold text-xl text-[#2d4437] mb-1">{usuario.nombreAlias}</h3>
              <Badge className="bg-[#6fae7f] text-white border-0 mb-4">{nivel.label}</Badge>
              <p className="text-sm text-gray-600 mb-1">{usuario.correo}</p>
              <p className="text-sm text-gray-600">Miembro desde {formatDate(usuario.fechaRegistro)}</p>
            </CardContent>
          </Card>

          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#3d5a47]" />
                Medallas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medals.map((medal, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${medal.obtained ? "bg-[#f5f7f5]" : "bg-gray-50 opacity-60"}`}>
                    <div className="text-3xl">{medal.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#2d4437]">{medal.name}</p>
                      <p className="text-xs text-gray-600 mb-1">{medal.description}</p>
                      <p className="text-xs text-gray-500">{medal.obtained ? "Obtenida" : "Pendiente"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
