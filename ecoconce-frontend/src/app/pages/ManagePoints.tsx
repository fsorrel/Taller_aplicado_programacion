import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, MapPin, Plus, Edit, Trash2, Clock, History } from "lucide-react";

export function ManagePoints() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<any>(null);
  const [selectedPointForHistory, setSelectedPointForHistory] = useState<any>(null);

  const [newPoint, setNewPoint] = useState({
    name: "",
    address: "",
    status: "Activo",
    hours: "",
    materials: {
      plastico: false,
      papel: false,
      vidrio: false,
      metal: false,
      organico: false,
      electronicos: false,
    },
  });

  const recyclingPoints = [
    {
      id: 1,
      name: "Ecopunto Plaza Perú",
      address: "Plaza Perú, Concepción",
      status: "Activo",
      capacity: 65,
      hours: "Lun-Dom 24/7",
      materials: ["Plástico", "Papel", "Vidrio", "Metal"],
      maintainer: "Juan Pérez",
      lastUpdate: "Hace 1 hora",
    },
    {
      id: 2,
      name: "Centro de Reciclaje Bio-Bio",
      address: "Av. Bio-Bio 1234, Concepción",
      status: "Activo",
      capacity: 45,
      hours: "Lun-Vie 9:00-18:00",
      materials: ["Electrónicos", "Metal", "Plástico"],
      maintainer: "María González",
      lastUpdate: "Hace 2 horas",
    },
    {
      id: 3,
      name: "Punto Verde Barros Arana",
      address: "Barros Arana 456, Concepción",
      status: "Congestionado",
      capacity: 95,
      hours: "Lun-Sab 8:00-20:00",
      materials: ["Papel", "Vidrio"],
      maintainer: "Carlos Ramírez",
      lastUpdate: "Hace 30 min",
    },
    {
      id: 4,
      name: "Ecocentro Tucapel",
      address: "Av. Tucapel 789, Concepción",
      status: "Colapsado",
      capacity: 100,
      hours: "Mar-Dom 10:00-19:00",
      materials: ["Orgánico", "Papel"],
      maintainer: "Ana Silva",
      lastUpdate: "Hace 15 min",
    },
    {
      id: 5,
      name: "Punto Limpio O'Higgins",
      address: "O'Higgins 321, Concepción",
      status: "Inactivo",
      capacity: 0,
      hours: "Cerrado temporalmente",
      materials: ["Plástico", "Metal"],
      maintainer: "Pedro Morales",
      lastUpdate: "Hace 3 días",
    },
  ];

  const filteredPoints = recyclingPoints.filter((point) =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pointHistory = {
    1: [
      { fecha: "Marzo 2026", estado: "Activo", observaciones: "Funcionamiento normal", materiales: "Plástico, Papel, Vidrio", compactados: 456 },
      { fecha: "Febrero 2026", estado: "Activo", observaciones: "Mantenimiento preventivo realizado", materiales: "Plástico, Papel, Vidrio", compactados: 423 },
      { fecha: "Enero 2026", estado: "Congestionado", observaciones: "Alta demanda durante festividades", materiales: "Plástico, Papel, Vidrio", compactados: 512 },
      { fecha: "Diciembre 2025", estado: "Activo", observaciones: "Funcionamiento óptimo", materiales: "Plástico, Papel, Vidrio", compactados: 389 },
    ],
    2: [
      { fecha: "Marzo 2026", estado: "Activo", observaciones: "Operación regular", materiales: "Electrónicos, Metal", compactados: 234 },
      { fecha: "Febrero 2026", estado: "Activo", observaciones: "Sin incidencias", materiales: "Electrónicos, Metal", compactados: 198 },
      { fecha: "Enero 2026", estado: "Inactivo", observaciones: "Reparación de equipos", materiales: "N/A", compactados: 0 },
    ],
    3: [
      { fecha: "Marzo 2026", estado: "Congestionado", observaciones: "Capacidad máxima alcanzada", materiales: "Papel, Vidrio", compactados: 567 },
      { fecha: "Febrero 2026", estado: "Activo", observaciones: "Operación normal", materiales: "Papel, Vidrio", compactados: 445 },
      { fecha: "Enero 2026", estado: "Activo", observaciones: "Vaciado semanal implementado", materiales: "Papel, Vidrio", compactados: 478 },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-700 border-green-200";
      case "Congestionado":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Colapsado":
        return "bg-red-100 text-red-700 border-red-200";
      case "Inactivo":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2d4437] mb-2">Gestión de Puntos de Reciclaje</h1>
          <p className="text-gray-600">Administra todos los puntos de reciclaje de la plataforma</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3d5a47] hover:bg-[#2d4437]">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Punto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Punto de Reciclaje</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Punto</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Ecopunto Centro"
                    value={newPoint.name}
                    onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Horario</Label>
                  <Input
                    id="hours"
                    placeholder="Ej: Lun-Vie 9:00-18:00"
                    value={newPoint.hours}
                    onChange={(e) => setNewPoint({ ...newPoint, hours: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Dirección completa"
                  value={newPoint.address}
                  onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Materiales Aceptados</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(newPoint.materials).map(([material, accepted]) => (
                    <div
                      key={material}
                      className="flex items-center justify-between p-3 bg-[#f5f7f5] rounded-lg"
                    >
                      <Label htmlFor={`new-${material}`} className="capitalize cursor-pointer">
                        {material}
                      </Label>
                      <Switch
                        id={`new-${material}`}
                        checked={accepted}
                        onCheckedChange={(checked) =>
                          setNewPoint({
                            ...newPoint,
                            materials: { ...newPoint.materials, [material]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    // Save logic here
                    setIsAddDialogOpen(false);
                  }}
                  className="flex-1 bg-[#3d5a47] hover:bg-[#2d4437]"
                >
                  Crear Punto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#2d4437] mb-1">87</p>
              <p className="text-sm text-gray-600">Total Puntos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 mb-1">72</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Congestionados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 mb-1">7</p>
              <p className="text-sm text-gray-600">Inactivos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-[#6fae7f]/20">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar puntos por nombre o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Points List */}
      <div className="space-y-4">
        {filteredPoints.map((point) => (
          <Card key={point.id} className="border-[#6fae7f]/20 hover:shadow-lg transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#6fae7f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#3d5a47]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-[#2d4437] mb-1">{point.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{point.address}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(point.status)}>{point.status}</Badge>
                      <Badge variant="outline" className="border-[#6fae7f]">
                        <Clock className="w-3 h-3 mr-1" />
                        {point.hours}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => setSelectedPointForHistory(point)}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <History className="w-5 h-5 text-[#3d5a47]" />
                          Historial de Recolección - {selectedPointForHistory?.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-gray-600 mb-6">
                          Historial mensual de actividad y recolección de materiales
                        </p>

                        <div className="space-y-4">
                          {pointHistory[selectedPointForHistory?.id as keyof typeof pointHistory]?.map((record, index) => (
                            <Card key={index} className="border-[#6fae7f]/20">
                              <CardContent className="p-4">
                                <div className="grid md:grid-cols-5 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Fecha de Recolección</p>
                                    <p className="font-medium text-[#2d4437]">{record.fecha}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Estado del Punto</p>
                                    <Badge className={getStatusColor(record.estado)}>
                                      {record.estado}
                                    </Badge>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-gray-600 mb-1">Materiales Retirados</p>
                                    <p className="text-sm text-gray-700">{record.materiales}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Materiales Compactados</p>
                                    <p className="font-bold text-[#3d5a47]">{record.compactados}</p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 mb-1">Observaciones</p>
                                  <p className="text-sm text-gray-700">{record.observaciones}</p>
                                </div>
                              </CardContent>
                            </Card>
                          )) || (
                            <div className="text-center py-8 text-gray-500">
                              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p>No hay historial disponible para este punto</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-[#3d5a47] text-[#3d5a47]">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Punto de Reciclaje</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                          Edita la información del punto: {point.name}
                        </p>
                        {/* Edit form would go here */}
                        <Button className="w-full bg-[#3d5a47] hover:bg-[#2d4437]">
                          Guardar Cambios
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Materiales Aceptados</p>
                  <div className="flex flex-wrap gap-1">
                    {point.materials.map((material, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-[#6fae7f]">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Responsable</p>
                  <p className="font-medium text-[#2d4437]">{point.maintainer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Capacidad Actual</p>
                  {point.status !== "Inactivo" ? (
                    <>
                      <p className="font-medium text-[#2d4437] mb-1">{point.capacity}%</p>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            point.capacity >= 90
                              ? "bg-red-500"
                              : point.capacity >= 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${point.capacity}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No disponible</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Última actualización: {point.lastUpdate}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPoints.length === 0 && (
        <Card className="border-[#6fae7f]/20">
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No se encontraron puntos</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
