"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestCameraPage() {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Verificar si mediaDevices está disponible
  const isMediaDevicesSupported =
    typeof navigator !== "undefined" && navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia

  const startCamera = async () => {
    try {
      setError(null)

      // Verificar soporte de mediaDevices
      if (!isMediaDevicesSupported) {
        throw new Error("Tu navegador no soporta acceso a la cámara o no estás usando HTTPS/localhost")
      }

      console.log("Solicitando acceso a la cámara...")

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      console.log("✅ Cámara obtenida:", mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      setIsActive(true)
    } catch (err: any) {
      console.error("❌ Error:", err)
      setError(`Error: ${err.name || "Unknown"} - ${err.message}`)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsActive(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba de Cámara</h1>

      {!isMediaDevicesSupported && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            <strong>Advertencia:</strong> Tu navegador no soporta acceso a la cámara o estás accediendo desde una
            conexión no segura.
            <br />
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Usa Chrome, Firefox o Edge actualizado</li>
              <li>
                Accede usando <code className="bg-yellow-100 px-1 rounded">localhost:3000</code> en lugar de una
                dirección IP
              </li>
              <li>O configura HTTPS para tu servidor</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
            <p className="text-sm mt-2">
              Asegúrate de que:
              <br />• Tu navegador tiene permisos para acceder a la cámara
              <br />• Tienes una cámara conectada y funcionando
              <br />• No hay otra aplicación usando la cámara
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          {!isActive ? (
            <Button onClick={startCamera} disabled={!isMediaDevicesSupported}>
              Iniciar Cámara
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive">
              Detener Cámara
            </Button>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isActive ? "block" : "none" }}
          />

          {!isActive && (
            <div className="text-center text-gray-500">
              <p>Haz clic en "Iniciar Cámara" para probar</p>
              {!isMediaDevicesSupported && <p className="text-red-500 mt-2">API de cámara no disponible</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
