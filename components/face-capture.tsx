"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Square, RotateCcw, CheckCircle } from "lucide-react"

interface FaceCaptureProps {
  onCapture: (imageData: string) => void
  title?: string
  description?: string
}

export function FaceCapture({
  onCapture,
  title = "Captura Facial",
  description = "Posiciona tu rostro en el centro",
}: FaceCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCapturing(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("No se pudo acceder a la cámara. Verifica los permisos.")
    }
  }, [])

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
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        stopCamera()
        onCapture(imageData)
      }
    }
  }, [stopCamera, onCapture])

  const resetCapture = () => {
    setCapturedImage(null)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
          {isCapturing && (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {/* Guía facial */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 border-2 border-white border-dashed rounded-lg opacity-70">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Posiciona tu rostro aquí
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {capturedImage && (
            <div className="relative w-full h-full">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
              </div>
            </div>
          )}

          {!isCapturing && !capturedImage && (
            <div className="text-center text-gray-500">
              <Camera className="h-16 w-16 mx-auto mb-4" />
              <p>Haz clic en "Iniciar Cámara" para comenzar</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex space-x-2">
          {!isCapturing && !capturedImage && (
            <Button onClick={startCamera} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Cámara
            </Button>
          )}

          {isCapturing && (
            <>
              <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700">
                <Square className="mr-2 h-4 w-4" />
                Capturar
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Cancelar
              </Button>
            </>
          )}

          {capturedImage && (
            <Button onClick={resetCapture} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Capturar Nuevamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
