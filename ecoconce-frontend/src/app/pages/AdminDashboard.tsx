import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const stats = [
    { 
      label: "Usuarios Activos", 
      value: "1,245", 
      change: "+12%", 
      trend: "up", 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Puntos de Reciclaje", 
      value: "87", 
      change: "+3", 
      trend: "up", 
      icon: MapPin, 
      color: "text-green-600",
      bgColor: "bg-green-50" 
    },
    {
      label: "Materiales Compactados (mes)",
      value: "12,800",
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Puntos Activos", 
      value: "72", 
      change: "-2", 
      trend: "down", 
      icon: Activity, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50" 
    },
  ];

  const monthlyData = [
    { month: "Ene", reciclado: 8500, usuarios: 980 },
    { month: "Feb", reciclado: 9200, usuarios: 1050 },
    { month: "Mar", reciclado: 10800, usuarios: 1120 },
    { month: "Abr", reciclado: 12800, usuarios: 1245 },
  ];

  const materialData = [
    { name: "Papel", value: 35, color: "#f59e0b" },
    { name: "Cartón", value: 28, color: "#d97706" },
    { name: "Botella de Plástico", value: 25, color: "#3b82f6" },
    { name: "Botella de Vidrio", value: 12, color: "#10b981" },
  ];

  const recentUsers = [
    { name: "María González", email: "maria.g@email.com", joined: "Hace 2 horas", points: 150 },
    { name: "Carlos Ramírez", email: "carlos.r@email.com", joined: "Hace 5 horas", points: 200 },
    { name: "Ana Silva", email: "ana.s@email.com", joined: "Ayer", points: 180 },
    { name: "Pedro Morales", email: "pedro.m@email.com", joined: "Hace 2 días", points: 220 },
  ];

  const pointsStatus = [
    { name: "Ecopunto Plaza Perú", status: "Activo", capacity: 65, lastUpdate: "Hace 1 hora" },
    { name: "Centro Bio-Bio", status: "Activo", capacity: 45, lastUpdate: "Hace 2 horas" },
    { name: "Punto Verde Barros Arana", status: "Congestionado", capacity: 95, lastUpdate: "Hace 30 min" },
    { name: "Ecocentro Tucapel", status: "Colapsado", capacity: 100, lastUpdate: "Hace 15 min" },
    { name: "Punto Limpio O'Higgins", status: "Inactivo", capacity: 0, lastUpdate: "Hace 3 días" },
  ];

  const alerts = [
    { type: "error", message: "Ecocentro Tucapel está colapsado", time: "Hace 15 min" },
    { type: "warning", message: "3 puntos cerca de capacidad máxima", time: "Hace 1 hora" },
    { type: "info", message: "Nueva actualización del sistema disponible", time: "Hace 2 horas" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f5f7f5]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2d4437] mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Vista general de la plataforma EcoConce</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#3d5a47] text-[#3d5a47]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#6fae7f]/20 hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge className={stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-[#2d4437] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {alerts.map((alert, index) => (
            <Card
              key={index}
              className={`border-2 ${
                alert.type === "error"
                  ? "border-red-200 bg-red-50"
                  : alert.type === "warning"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.type === "error"
                      ? "text-red-600"
                      : alert.type === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Monthly Trends */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Tendencias Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recyclado" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 mb-6">
                  <TabsTrigger value="recyclado">Material Reciclado</TabsTrigger>
                  <TabsTrigger value="usuarios">Nuevos Usuarios</TabsTrigger>
                </TabsList>

                <TabsContent value="recyclado">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reciclado" fill="#3d5a47" name="Materiales Compactados" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="usuarios">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="usuarios" stroke="#3d5a47" strokeWidth={2} name="Usuarios" />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Material Distribution */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437]">Distribución de Materiales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={materialData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {materialData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-[#2d4437]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#2d4437] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3d5a47]" />
                Usuarios Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#3d5a47]">
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#f5f7f5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6fae7f] rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#2d4437]">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 mb-1">
                        {user.points} pts
                      </Badge>
                      <p className="text-xs text-gray-500">{user.joined}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Points Status */}
        <div className="space-y-8">
          <Card className="border-[#6fae7f]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#2d4437] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#3d5a47]" />
                Estado de Puntos
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#3d5a47]" asChild>
                <a href="/admin/puntos">Gestionar</a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pointsStatus.map((point, index) => (
                <div key={index} className="p-4 bg-[#f5f7f5] rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-[#2d4437] text-sm">{point.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`text-xs ${
                            point.status === "Activo"
                              ? "bg-green-100 text-green-700"
                              : point.status === "Congestionado"
                              ? "bg-yellow-100 text-yellow-700"
                              : point.status === "Colapsado"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {point.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {point.status !== "Inactivo" && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Capacidad</span>
                        <span>{point.capacity}%</span>
                      </div>
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
                    </div>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {point.lastUpdate}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-[#6fae7f]/20 bg-gradient-to-br from-[#6fae7f] to-[#3d5a47] text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Resumen del Mes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Materiales Compactados</span>
                  <span className="font-bold text-xl">12,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Nuevos Usuarios</span>
                  <span className="font-bold text-xl">265</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Puntos Activos</span>
                  <span className="font-bold text-xl">72/87</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Tasa de Uso</span>
                  <span className="font-bold text-xl">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-[#6fae7f]/20">
            <CardHeader>
              <CardTitle className="text-[#2d4437] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#3d5a47]" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">API Backend</span>
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Base de Datos</span>
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Formularios reciclaje</span>
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Servicios de Mapa</span>
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Operativo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
