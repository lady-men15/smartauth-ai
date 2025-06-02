import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { faceData } = await request.json()

    if (!faceData) {
      return NextResponse.json({ error: "Datos faciales requeridos" }, { status: 400 })
    }

    // Simular proceso de reconocimiento facial
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular comparación con base de datos (90% éxito)
    const isAuthenticated = Math.random() > 0.1

    if (isAuthenticated) {
      // Simular usuario reconocido
      const mockUsers = [
        { id: "1", name: "Carlos Ramírez", email: "carlos@example.com" },
        { id: "2", name: "Ana García", email: "ana@example.com" },
        { id: "3", name: "Luis Martínez", email: "luis@example.com" },
        { id: "4", name: "María López", email: "maria@example.com" },
      ]

      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]

      // En un sistema real, aquí se generaría un JWT token
      const token = "jwt_token_" + user.id + "_" + Date.now()

      return NextResponse.json({
        success: true,
        message: "Autenticación exitosa",
        user,
        token,
        confidence: (95 + Math.random() * 4).toFixed(1) + "%",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no reconocido",
          confidence: (60 + Math.random() * 20).toFixed(1) + "%",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Error en autenticación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
