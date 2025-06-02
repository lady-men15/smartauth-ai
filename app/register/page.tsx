"use client"

import type React from "react"

import { useState, useRef, useCallback , useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, User, Mail, Lock, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsCapturing(true)
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al acceder a la cámara. Por favor, permite el acceso." })
    }
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) {
      setMessage({ type: "error", text: "No se pudo obtener el contexto del canvas." })
      return
    }

    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    if (videoWidth === 0 || videoHeight === 0) {
      setMessage({ type: "error", text: "La cámara no está lista para capturar. Intenta nuevamente." })
      return
    }

    canvas.width = videoWidth
    canvas.height = videoHeight

    context.drawImage(video, 0, 0, videoWidth, videoHeight)

    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageData)

    const stream = video.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    setIsCapturing(false)
    speakText("Imagen facial capturada correctamente")
  }, [])

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!capturedImage) {
      setMessage({ type: "error", text: "Por favor, captura tu imagen facial antes de continuar." })
      return
    }

    setIsRegistering(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const biometricData = {
        userId: Date.now(),
        name: formData.name,
        email: formData.email,
        facialData: capturedImage,
        registeredAt: new Date().toISOString(),
      }

      localStorage.setItem("userBiometric", JSON.stringify(biometricData))

      setMessage({ type: "success", text: "Registro completado exitosamente!" })
      speakText(`Bienvenido ${formData.name}, tu registro ha sido completado exitosamente`)

      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Error durante el registro. Inténtalo nuevamente." })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Registro Biométrico</CardTitle>
          <CardDescription className="text-lg">Completa tu registro con autenticación facial</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña segura"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Captura Facial</Label>

              <div className="bg-gray-100 rounded-lg p-6 text-center">
                {!isCapturing && !capturedImage && (
                  <div className="space-y-4">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Necesitamos capturar tu rostro para la autenticación biométrica</p>
                    <Button onClick={startCamera} type="button">
                      <Camera className="mr-2 h-4 w-4" />
                      Iniciar Cámara
                    </Button>
                  </div>
                )}

                {isCapturing && (
                  <div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
                    <div className="space-x-4">
                      <Button onClick={capturePhoto} type="button">
                        Capturar Foto
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const stream = videoRef.current?.srcObject as MediaStream
                          if (stream) {
                            stream.getTracks().forEach((track) => track.stop())
                          }
                          setIsCapturing(false)
                        }}
                        type="button"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="space-y-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Imagen capturada"
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <div className="flex items-center justify-center text-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      Imagen facial capturada correctamente
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCapturedImage(null)
                        startCamera()
                      }}
                      type="button"
                    >
                      Capturar Nueva Foto
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isRegistering || !capturedImage}>
              {isRegistering ? "Registrando..." : "Completar Registro"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}