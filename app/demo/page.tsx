"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Shield, Bell, Settings, LogOut, Brain, Zap, Eye, Volume2 } from "lucide-react"
import Link from "next/link"

// Componente de gráfico simulado
function MockChart({ title, data, color = "blue" }: { title: string; data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="flex items-end space-x-1 h-32">
        {data.map((value, index) => {
          const height = ((value - min) / (max - min)) * 100
          return (
            <div
              key={index}
              className={`bg-${color}-500 rounded-t flex-1 transition-all hover:bg-${color}-600`}
              style={{ height: `${height}%`, minHeight: "4px" }}
              title={`Valor: ${value}`}
            />
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [currentUser] = useState("Carlos Ramírez")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [predictions, setPredictions] = useState({
    temperature: [] as number[],
    sales: [] as number[],
    users: [] as number[],
    security: [] as number[],
  })

  // Generar datos de predicción simulados
  useEffect(() => {
    const generatePredictions = () => {
      const generateData = (base: number, variance: number, trend = 0) => {
        return Array.from({ length: 12 }, (_, i) => {
          const trendValue = base + trend * i
          const randomVariance = (Math.random() - 0.5) * variance
          return Math.round(trendValue + randomVariance)
        })
      }

      setPredictions({
        temperature: generateData(22, 8, 0.2),
        sales: generateData(1000, 300, 50),
        users: generateData(150, 50, 10),
        security: generateData(95, 10, 0.1),
      })
    }

    generatePredictions()

    // Actualizar tiempo cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Actualizar predicciones cada 30 segundos
    const predictionInterval = setInterval(generatePredictions, 30000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(predictionInterval)
    }
  }, [])

  // Síntesis de voz de bienvenida
  useEffect(() => {
    const welcomeMessage = `Bienvenido al dashboard, ${currentUser}. Todos los sistemas están funcionando correctamente.`

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(welcomeMessage)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }, [currentUser])

  const stats = [
    {
      title: "Usuarios Activos",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "blue",
    },
    {
      title: "Autenticaciones Hoy",
      value: "89",
      change: "+5%",
      icon: Shield,
      color: "green",
    },
    {
      title: "Precisión IA",
      value: "99.7%",
      change: "+0.2%",
      icon: Brain,
      color: "purple",
    },
    {
      title: "Tiempo Respuesta",
      value: "0.8s",
      change: "-0.1s",
      icon: Zap,
      color: "orange",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartAuthAI Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - {currentTime.toLocaleTimeString("es-ES")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <Eye className="mr-1 h-3 w-3" />
                {currentUser}
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de Bienvenida */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {currentUser}!</h2>
                <p className="text-blue-100">Autenticación facial exitosa. Acceso completo al sistema.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-6 w-6" />
                <span className="text-sm">Audio activado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} vs ayer
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Principal */}
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Predicciones IA</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab de Predicciones */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Predicción de Temperatura
                  </CardTitle>
                  <CardDescription>Forecast de temperatura para los próximos 12 períodos</CardDescription>
                </CardHeader>
                <CardContent>
                  <MockChart title="Temperatura (°C)" data={predictions.temperature} color="red" />
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Predicción:</strong> Tendencia al alza con variaciones estacionales normales.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Predicción de Ventas
                  </CardTitle>
                  <CardDescription>Forecast de ventas basado en datos históricos</CardDescription>
                </CardHeader>
                <CardContent>
                  <MockChart title="Ventas (unidades)" data={predictions.sales} color="green" />
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Predicción:</strong> Crecimiento sostenido del 15% mensual.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Predicción de Usuarios
                  </CardTitle>
                  <CardDescription>Crecimiento esperado de la base de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <MockChart title="Usuarios Activos" data={predictions.users} color="blue" />
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Predicción:</strong> Adopción acelerada en los próximos meses.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Índice de Seguridad
                  </CardTitle>
                  <CardDescription>Predicción de métricas de seguridad del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <MockChart title="Seguridad (%)" data={predictions.security} color="orange" />
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Predicción:</strong> Mantenimiento de altos estándares de seguridad.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Seguridad */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                  <CardDescription>Monitoreo en tiempo real</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Autenticación Facial</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encriptación</span>
                    <Badge className="bg-green-100 text-green-800">256-bit</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Firewall</span>
                    <Badge className="bg-green-100 text-green-800">Protegido</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup</span>
                    <Badge className="bg-blue-100 text-blue-800">Sincronizado</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimos eventos de seguridad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Login exitoso - {currentUser}</span>
                      <span className="text-xs text-gray-500 ml-auto">Ahora</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Backup automático completado</span>
                      <span className="text-xs text-gray-500 ml-auto">5 min</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Intento de acceso fallido</span>
                      <span className="text-xs text-gray-500 ml-auto">1 hora</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Analíticas */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
                <CardDescription>Análisis detallado del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">99.7%</div>
                    <div className="text-sm text-gray-600">Precisión Facial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">0.8s</div>
                    <div className="text-sm text-gray-600">Tiempo Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">1,234</div>
                    <div className="text-sm text-gray-600">Usuarios Registrados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Configuración */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>Ajustes y preferencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Feedback de Voz</span>
                  <Badge className="bg-green-100 text-green-800">Habilitado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  <Badge className="bg-blue-100 text-blue-800">Activas</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Modo Oscuro</span>
                  <Badge className="bg-gray-100 text-gray-800">Deshabilitado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-backup</span>
                  <Badge className="bg-green-100 text-green-800">Cada 6h</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
