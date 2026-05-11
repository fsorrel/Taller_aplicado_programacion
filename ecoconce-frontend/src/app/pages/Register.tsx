import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Recycle } from "lucide-react";
import { api, BdRow, findUsuarioByEmail, saveCurrentUser } from "../lib/api";

export function Register() {
  const navigate = useNavigate();
  const [comunas, setComunas] = useState<BdRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreAlias: "",
    rut: "",
    fechaNacimiento: "",
    sexoGenero: "",
    correo: "",
    contrasena: "",
    confirmPassword: "",
    telefono: "",
    comunaId: 1,
    direccion: "",
  });

  useEffect(() => {
    api.comunas().then((data) => {
      setComunas(data);
      if (data[0]) setFormData((prev) => ({ ...prev, comunaId: Number(data[0].id) }));
    }).catch(() => setComunas([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.contrasena !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await api.registrarUsuario({
        rut: formData.rut,
        nombreAlias: formData.nombreAlias,
        correo: formData.correo,
        contrasena: formData.contrasena,
        sexoGenero: formData.sexoGenero,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        comunaId: Number(formData.comunaId),
        direccion: formData.direccion,
        rolId: 1,
      });

      const usuarioCompleto = await findUsuarioByEmail(formData.correo);
      saveCurrentUser(usuarioCompleto ?? {
        rut: formData.rut,
        nombreAlias: formData.nombreAlias,
        correo: formData.correo,
        sexoGenero: formData.sexoGenero,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        comunaId: Number(formData.comunaId),
        direccion: formData.direccion,
        puntos: 0,
        rolId: 1,
        rol: "Ciudadano",
        activo: "S",
      });
      navigate("/ciudadano");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7f5] to-[#e8ede9] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#3d5a47] rounded-full flex items-center justify-center">
              <Recycle className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-[#3d5a47]">EcoConce</span>
          </Link>
          <p className="text-gray-600">Únete a la comunidad</p>
        </div>

        <Card className="border-[#6fae7f]/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[#2d4437]">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Este registro usa los atributos reales principales de la tabla usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreAlias">Nombre o Alias *</Label>
                  <Input id="nombreAlias" value={formData.nombreAlias} onChange={(e) => setFormData({ ...formData, nombreAlias: e.target.value })} required className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT *</Label>
                  <Input id="rut" placeholder="12.345.678-9" value={formData.rut} onChange={(e) => setFormData({ ...formData, rut: e.target.value })} required className="border-gray-300" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                  <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} required className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexoGenero">Sexo / Género</Label>
                  <select id="sexoGenero" value={formData.sexoGenero} onChange={(e) => setFormData({ ...formData, sexoGenero: e.target.value })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input id="correo" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="border-gray-300" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comunaId">Comuna *</Label>
                  <select id="comunaId" value={formData.comunaId} onChange={(e) => setFormData({ ...formData, comunaId: Number(e.target.value) })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    {comunas.length === 0 && <option value={1}>Concepción</option>}
                    {comunas.map((comuna) => <option key={Number(comuna.id)} value={Number(comuna.id)}>{String(comuna.nombre)}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="border-gray-300" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contrasena">Contraseña *</Label>
                  <Input id="contrasena" type="password" value={formData.contrasena} onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })} required className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required className="border-gray-300" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Acepto los términos y condiciones de EcoConce</span>
              </div>
              <Button disabled={loading} type="submit" className="w-full bg-[#3d5a47] hover:bg-[#2d4437]">
                {loading ? "Creando..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="text-[#3d5a47] hover:underline font-medium">Inicia sesión</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
