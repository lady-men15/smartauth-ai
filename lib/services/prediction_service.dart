import 'dart:convert';
import 'package:http/http.dart' as http;

class PredictionService {
  static const String baseUrl = 'http://localhost:3000/api';
  // Para dispositivo físico usa: 'http://TU_IP:3000/api'
  // Para emulador Android usa: 'http://10.0.2.2:3000/api'

  Future<Map<String, dynamic>> getAllPredictions() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/predictions?type=all'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Error cargando predicciones');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  Future<Map<String, dynamic>> getPrediction(String type) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/predictions?type=$type'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Error cargando predicción');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
