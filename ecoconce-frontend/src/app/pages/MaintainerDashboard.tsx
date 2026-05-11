import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { 
  MapPin, 
  Activity, 
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Edit,
  Save
} from "lucide-react";

export function MaintainerDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [pointData, setPointData] = useState({
    name: "Ecopunto Plaza Perú",
    address: "Plaza Perú, Concepción",
    status: "Activo",
    capacity: 65,
    hours: "Lun-Dom 24/7",
    materials: {
      plastico: true,
      papel: true,
      vidrio: true,
      metal: true,
      organico: false,
      electronicos: false,
    },
    notes: "",
  });

  const stats = [
    { 
      label: "Visitas Hoy", 
      value: "24", 
      icon: Activity, 
      color: "text-blue-600",
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Capacidad Actual", 
      value: "65%", 
      icon: Package, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50" 
    },
    {
      label: "Materiales Compactados Hoy",
      value: "127",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Tiempo Activo", 
      value: "24/7", 
      icon: Clock, 
      color: "text-purple-600",
      bgColor: "bg-purple-50" 
    },
  ];

  const recentActivity = [
    { user: "María González", material: "Plástico", compacted: "2 materiales", time: "Hace 15 min" },
    { user: "Carlos Ramírez", material: "Papel", compacted: "3 materiales", time: "Hace 30 min" },
    { user: "Ana Silva", material: "Vidrio", compacted: "4 materiales", time: "Hace 1 hora" },
    { user: "Pedro Morales", material: "Metal", compacted: "2 materiales", time: "Hace 2 horas" },
  ];

  const weeklyData = [
    { day: "Lun", visits: 28, compacted: 156 },
    { day: "Mar", visits: 32, compacted: 178 },
    { day: "Mié", visits: 25, compacted: 142 },
    { day: "Jue", visits: 30, compacted: 168 },
    { day: "Vie", visits: 35, compacted: 195 },
    { day: "Sáb", visits: 22, compacted: 125 },
    { day: "Dom", visits: 18, compacted: 98 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-700";
      case "Congestionado":
        return "bg-yellow-100 text-yellow-700";
      case "Colapsado":
        return "bg-red-100 text-red-700";
      case "Inactivo":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2d4437] mb-2">Mi Punto de Reciclaje</h1>
          <p className="text-gray-600">Gestiona y actualiza el estado de tu punto asignado</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-[#3d5a47] hover:bg-[#2d4437]"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Editar Punto
            </>
          )}
        </Button>
      </div>

      {/* Point Info Card */}
      <Card className="border-[#6fae7f]/20 bg-gradient-to-r from-[#3d5a47] to-[#6fae7f] text-white">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{pointData.name}</h2>
                  <p className="text-lg opacity-90">{pointData.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(pointData.status)} border-0 text-base px-4 py-1`}>
                  {pointData.status}
                </Badge>
                <span className="text-sm opacity-90">{pointData.hours}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#6fae7f]/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2d4437]">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Management */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Management */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Actualizar Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Selection */}
              <div className="space-y-3">
                <Label>Estado del Punto</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Activo", "Congestionado", "Colapsado", "Inactivo"].map((status) => (
                    <Button
                      key={status}
                      variant={pointData.status === status ? "default" : "outline"}
                      className={
                        pointData.status === status
                          ? "bg-[#3d5a47] hover:bg-[#2d4437]"
                          : "border-gray-300"
                      }
                      onClick={() => isEditing && setPointData({ ...pointData, status })}
                      disabled={!isEditing}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Capacity Slider */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Nivel de Capacidad</Label>
                  <span className="font-bold text-[#2d4437]">{pointData.capacity}%</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pointData.capacity}
                    onChange={(e) =>
                      isEditing && setPointData({ ...pointData, capacity: parseInt(e.target.value) })
                    }
                    disabled={!isEditing}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pointData.capacity >= 90
                          ? "bg-red-500"
                          : pointData.capacity >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${pointData.capacity}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-2">
                <Label htmlFor="hours">Horario de Atención</Label>
                <Input
                  id="hours"
                  value={pointData.hours}
                  onChange={(e) => setPointData({ ...pointData, hours: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Materials Accepted */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Materiales Aceptados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(pointData.materials).map(([material, accepted]) => (
                  <div
                    key={material}
                    className="flex items-center justify-between p-4 bg-[#f5f7f5] rounded-lg"
                  >
                    <Label htmlFor={material} className="capitalize cursor-pointer">
                      {material}
                    </Label>
                    <Switch
                      id={material}
                      checked={accepted}
                      onCheckedChange={(checked) =>
                        isEditing &&
                        setPointData({
                          ...pointData,
                          materials: { ...pointData.materials, [material]: checked },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes / Incidents */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Notas e Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Reporta cualquier incidente o observación importante..."
                value={pointData.notes}
                onChange={(e) => setPointData({ ...pointData, notes: e.target.value })}
                disabled={!isEditing}
                rows={5}
                className={!isEditing ? "bg-gray-50" : ""}
              />
              {isEditing && (
                <p className="text-sm text-gray-600 mt-2">
                  Los administradores recibirán una notificación sobre cualquier incidente reportado.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Rendimiento Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#2d4437]">{day.day}</span>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>{day.visits} visitas</span>
                        <span className="font-bold">{day.compacted} materiales</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6fae7f]"
                        style={{ width: `${(day.compacted / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-8">
          {/* Quick Alerts */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#3d5a47]" />
                Alertas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pointData.capacity >= 90 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Capacidad crítica</p>
                  <p className="text-xs text-red-700">El punto está cerca de su límite</p>
                </div>
              )}
              {pointData.capacity >= 70 && pointData.capacity < 90 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Capacidad alta</p>
                  <p className="text-xs text-yellow-700">Considera vaciar pronto</p>
                </div>
              )}
              {pointData.capacity < 70 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Estado óptimo</p>
                    <p className="text-xs text-green-700">El punto funciona correctamente</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 bg-[#f5f7f5] rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm text-[#2d4437]">{activity.user}</p>
                      <Badge variant="outline" className="text-xs border-[#6fae7f]">
                        {activity.material}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{activity.compacted}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card className="border-[#6fae7f]/20 bg-gradient-to-br from-[#6fae7f] to-[#3d5a47] text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Resumen del Mes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Total Visitantes</span>
                  <span className="font-bold text-2xl">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Materiales Compactados</span>
                  <span className="font-bold text-2xl">1,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Días Activo</span>
                  <span className="font-bold text-2xl">28/30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Promedio Diario</span>
                  <span className="font-bold text-2xl">19 visitas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">¿Necesitas Ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Contacta al equipo de administración si necesitas asistencia o reportar un problema.
              </p>
              <Button className="w-full bg-[#3d5a47] hover:bg-[#2d4437]">
                Contactar Administración
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
