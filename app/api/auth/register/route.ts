import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, faceData } = await request.json()

    // Validar datos requeridos
    if (!name || !email || !phone || !faceData) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Simular procesamiento de datos biométricos
    const userId = Math.random().toString(36).substr(2, 9)
    const timestamp = new Date().toISOString()

    // En un sistema real, aquí se guardarían los datos en la base de datos
    // y se procesarían las características faciales
    const userData = {
      id: userId,
      name,
      email,
      phone,
      faceEncoding: "encoded_face_data_" + userId, // Simulado
      createdAt: timestamp,
      isActive: true,
    }

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
