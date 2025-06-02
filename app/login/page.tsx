"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, AlertCircle, ArrowLeft, Loader2, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authResult, setAuthResult] = useState<"success" | "failed" | null>(null)
  const [recognizedUser, setRecognizedUser] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      setError(null)

      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta acceso a la cámara o estás usando una conexión no segura")
      }

      // Limpiar cualquier stream anterior
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // Solicitar acceso con configuración específica
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }, // Limitar framerate para evitar parpadeo
          facingMode: "user",
        },
        audio: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream

        // Esperar a que el video esté listo
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.error("Error reproduciendo video:", e)
            setError("Error al iniciar la reproducción de video")
          })
        }
      }

      setIsCapturing(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setError(`Error de cámara: ${error instanceof Error ? error.message : "Acceso denegado"}. 
      Asegúrate de permitir el acceso a la cámara en tu navegador y usar localhost o HTTPS.`)
    }
  }, [stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Asegurarse de que las dimensiones coincidan con el video
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // Dibujar el frame actual del video en el canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convertir a imagen
        try {
          const imageData = canvas.toDataURL("image/jpeg", 0.9)
          setCapturedImage(imageData)
          stopCamera()
        } catch (e) {
          console.error("Error capturando imagen:", e)
          setError("Error al capturar la imagen. Intenta nuevamente.")
        }
      }
    }
  }, [stopCamera])

  const authenticateUser = useCallback(async () => {
    if (!capturedImage) return

    setIsAuthenticating(true)

    // Simular proceso de autenticación facial
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simular resultado de autenticación (90% éxito)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      const mockUsers = ["Carlos Ramírez", "Ana García", "Luis Martínez", "Lady Piguave"]
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]

      setRecognizedUser(user)
      setAuthResult("success")

      // Síntesis de voz
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(`Bienvenido, ${user}. Autenticación exitosa.`)
        utterance.lang = "es-ES"
        speechSynthesis.speak(utterance)
      }

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else {
      setAuthResult("failed")

      // Síntesis de voz para fallo
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("Autenticación fallida. Usuario no reconocido.")
        utterance.lang = "es-ES"
        speechSynthesis.speak(utterance)
      }
    }

    setIsAuthenticating(false)
  }, [capturedImage, router])

  const resetAuth = () => {
    setCapturedImage(null)
    setAuthResult(null)
    setRecognizedUser(null)
    setError(null)
  }

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Badge className="bg-blue-100 text-blue-800">Autenticación Facial</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </CardTitle>
              <CardDescription>Utiliza el reconocimiento facial para acceder al sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instrucciones */}
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Posiciona tu rostro frente a la cámara y captura una foto para autenticarte.
                </AlertDescription>
              </Alert>

              {/* Mensaje de error */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Controles de Cámara */}
              {!capturedImage && !authResult && (
                <div className="space-y-4">
                  {!isCapturing && (
                    <Button onClick={startCamera} className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Iniciar Cámara
                    </Button>
                  )}

                  {isCapturing && (
                    <div className="space-y-2">
                      <Button onClick={capturePhoto} className="w-full bg-green-600 hover:bg-green-700">
                        Capturar y Autenticar
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="w-full">
                        Detener Cámara
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Foto Capturada */}
              {capturedImage && !authResult && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Foto capturada. Procesando autenticación facial...</AlertDescription>
                  </Alert>

                  <Button onClick={authenticateUser} className="w-full" disabled={isAuthenticating}>
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Autenticando...
                      </>
                    ) : (
                      "Procesar Autenticación"
                    )}
                  </Button>

                  <Button onClick={resetAuth} variant="outline" className="w-full">
                    Capturar Nueva Foto
                  </Button>
                </div>
              )}

              {/* Resultado de Autenticación */}
              {authResult === "success" && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>¡Autenticación Exitosa!</strong>
                      <br />
                      Bienvenido, {recognizedUser}
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                    <Volume2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 text-sm">Reproduciendo mensaje de bienvenida...</span>
                  </div>

                  <p className="text-center text-sm text-gray-600">Redirigiendo al dashboard...</p>
                </div>
              )}

              {authResult === "failed" && (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Autenticación Fallida</strong>
                      <br />
                      Usuario no reconocido. Intenta nuevamente.
                    </AlertDescription>
                  </Alert>

                  <div className="flex space-x-2">
                    <Button onClick={resetAuth} className="flex-1">
                      Intentar Nuevamente
                    </Button>
                    <Link href="/register">
                      <Button variant="outline">Registrarse</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Opciones Adicionales */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 text-center mb-4">¿No tienes una cuenta?</p>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Crear Cuenta Nueva
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Vista de Cámara */}
          <Card>
            <CardHeader>
              <CardTitle>Vista de Cámara</CardTitle>
              <CardDescription>
                {isCapturing && "Posiciona tu rostro en el centro de la imagen"}
                {capturedImage && !authResult && "Imagen capturada - Lista para autenticación"}
                {authResult === "success" && "Autenticación exitosa"}
                {authResult === "failed" && "Autenticación fallida"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                {isCapturing && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }} // Espejo para mejor experiencia
                    />
                    {/* Overlay de guía facial */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-64 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                    </div>
                  </>
                )}

                {capturedImage && (
                  <div className="relative w-full h-full">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured face"
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }} // Mantener consistencia con el video
                    />
                    {isAuthenticating && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p>Procesando...</p>
                        </div>
                      </div>
                    )}
                    {authResult === "success" && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                      </div>
                    )}
                    {authResult === "failed" && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                        <AlertCircle className="h-16 w-16 text-red-600" />
                      </div>
                    )}
                  </div>
                )}

                {!isCapturing && !capturedImage && (
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p>Inicia la cámara para comenzar</p>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {/* Indicadores de Estado */}
              <div className="mt-4 flex justify-center space-x-4 text-sm">
                <div className={`flex items-center ${isCapturing ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isCapturing ? "bg-green-600" : "bg-gray-400"}`}></div>
                  Cámara
                </div>
                <div className={`flex items-center ${capturedImage ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${capturedImage ? "bg-blue-600" : "bg-gray-400"}`}></div>
                  Captura
                </div>
                <div className={`flex items-center ${authResult === "success" ? "text-green-600" : "text-gray-400"}`}>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${authResult === "success" ? "bg-green-600" : "bg-gray-400"}`}
                  ></div>
                  Autenticado
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
