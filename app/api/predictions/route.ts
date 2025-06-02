import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    // Función para generar datos de predicción
    const generatePredictionData = (base: number, variance: number, trend = 0, periods = 12) => {
      return Array.from({ length: periods }, (_, i) => {
        const trendValue = base + trend * i
        const randomVariance = (Math.random() - 0.5) * variance
        const seasonality = Math.sin((i / periods) * 2 * Math.PI) * (variance * 0.3)
        return Math.round(trendValue + randomVariance + seasonality)
      })
    }

    const predictions = {
      temperature: {
        data: generatePredictionData(22, 8, 0.2),
        unit: "°C",
        trend: "ascending",
        confidence: 87,
        description: "Tendencia al alza con variaciones estacionales normales",
      },
      sales: {
        data: generatePredictionData(1000, 300, 50),
        unit: "unidades",
        trend: "ascending",
        confidence: 92,
        description: "Crecimiento sostenido del 15% mensual esperado",
      },
      users: {
        data: generatePredictionData(150, 50, 10),
        unit: "usuarios",
        trend: "ascending",
        confidence: 89,
        description: "Adopción acelerada en los próximos períodos",
      },
      security: {
        data: generatePredictionData(95, 5, 0.1),
        unit: "%",
        trend: "stable",
        confidence: 96,
        description: "Mantenimiento de altos estándares de seguridad",
      },
      performance: {
        data: generatePredictionData(85, 10, 2),
        unit: "%",
        trend: "ascending",
        confidence: 91,
        description: "Mejora continua en métricas de rendimiento",
      },
    }

    // Simular delay de procesamiento de IA
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (type === "all") {
      return NextResponse.json({
        success: true,
        predictions,
        generatedAt: new Date().toISOString(),
        algorithm: "Prophet + ARIMA",
        modelVersion: "2.1.0",
      })
    } else if (predictions[type as keyof typeof predictions]) {
      return NextResponse.json({
        success: true,
        prediction: predictions[type as keyof typeof predictions],
        type,
        generatedAt: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({ error: "Tipo de predicción no válido" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error generando predicciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
