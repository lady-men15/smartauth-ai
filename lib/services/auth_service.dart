import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class AuthService {
  // Cambia esta URL por la de tu servidor
  static const String baseUrl = 'http://localhost:3000/api';
  // Para dispositivo físico usa: 'http://TU_IP:3000/api'
  // Para emulador Android usa: 'http://10.0.2.2:3000/api'

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String phone,
    required String imagePath,
  }) async {
    try {
      // Leer la imagen
      final File imageFile = File(imagePath);
      final List<int> imageBytes = await imageFile.readAsBytes();
      final String base64Image = base64Encode(imageBytes);

      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'name': name,
          'email': email,
          'phone': phone,
          'faceData': base64Image,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'error': error['error'] ?? 'Error en el registro',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Error de conexión: $e',
      };
    }
  }

  Future<Map<String, dynamic>> authenticateWithFace(String imagePath) async {
    try {
      // Leer la imagen
      final File imageFile = File(imagePath);
      final List<int> imageBytes = await imageFile.readAsBytes();
      final String base64Image = base64Encode(imageBytes);

      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'faceData': base64Image,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'error': error['error'] ?? 'Autenticación fallida',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Error de conexión: $e',
      };
    }
  }
}
