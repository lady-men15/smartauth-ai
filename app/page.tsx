"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Camera, Smartphone, Volume2, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SmartAuthAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/register">
              <Button variant="outline">Registro</Button>
            </Link>
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">🚀 Tecnología de Vanguardia</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Autenticación Biométrica
            <span className="text-blue-600"> con IA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma avanzada de autenticación facial con reconocimiento biométrico, feedback por voz y dashboard
            inteligente con predicciones basadas en IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Camera className="mr-2 h-5 w-5" />
                Comenzar Registro
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Reconocimiento Facial</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Autenticación biométrica avanzada usando tecnología de reconocimiento facial en tiempo real.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>App Móvil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Integración móvil completa con autenticación desde dispositivos Android e iOS.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Volume2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Feedback de Voz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Síntesis de voz personalizada que da la bienvenida a cada usuario autenticado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Dashboard IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dashboard inteligente con predicciones y análisis de datos en tiempo real.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Stack Tecnológico</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Backend Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Next.js API Routes</li>
                  <li>• Autenticación JWT</li>
                  <li>• Encriptación de datos</li>
                  <li>• Validación biométrica</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Inteligencia Artificial</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Reconocimiento facial</li>
                  <li>• Machine Learning</li>
                  <li>• Predicciones en tiempo real</li>
                  <li>• Análisis de patrones</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Frontend Moderno</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• React 18 + Next.js 15</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Componentes shadcn/ui</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Precisión Facial</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{"<"}1s</div>
              <div className="text-blue-200">Tiempo de Autenticación</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">256-bit</div>
              <div className="text-blue-200">Encriptación</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">SmartAuthAI</span>
          </div>
          <p className="text-gray-400 mb-4">Proyecto Integrador - Sistema de Autenticación Biométrica con IA</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Desarrollo de Software</span>
            <span>•</span>
            <span>Inteligencia Artificial</span>
            <span>•</span>
            <span>Seguridad Biométrica</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
