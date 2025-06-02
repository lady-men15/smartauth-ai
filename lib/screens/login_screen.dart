import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter/services.dart';

class AuthenticationScreen extends StatefulWidget {
  @override
  _AuthenticationScreenState createState() => _AuthenticationScreenState();
}

class _AuthenticationScreenState extends State<AuthenticationScreen> {
  final LocalAuthentication _localAuth = LocalAuthentication();
  bool _useBiometric = false;

  @override
  void initState() {
    super.initState();
    _checkBiometricAvailability();
  }

  Future<void> _checkBiometricAvailability() async {
    try {
      final bool isAvailable = await _localAuth.isDeviceSupported();
      final bool canCheckBiometrics = await _localAuth.canCheckBiometrics;
      
      setState(() {
        _useBiometric = isAvailable && canCheckBiometrics;
      });
    } catch (e) {
      if (e is PlatformException) {
        switch (e.code) {
          case 'biometrics_not_available':
            _showErrorDialog('Autenticación biométrica no disponible en este dispositivo');
            break;
          case 'not_enrolled':
            _showErrorDialog('No se han registrado huellas dactilares o reconocimiento facial');
            break;
          case 'permission_denied':
            _showErrorDialog('Permiso denegado para acceder a la autenticación biométrica');
            break;
          default:
            _showErrorDialog('Error al verificar la autenticación biométrica: ${e.message}');
        }
      } else {
        _showErrorDialog('Error al verificar la autenticación biométrica: $e');
      }
    }
  }

  Future<void> _showErrorDialog(String message) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Aceptar'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Autenticación'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_useBiometric) ...[
              Icon(Icons.fingerprint, size: 80),
              SizedBox(height: 16),
              Text('Autenticación biométrica'),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  // Lógica de autenticación biométrica
                },
                child: Text('Iniciar sesión con biometría'),
              ),
            ],
            if (!_useBiometric) ...[
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  // Lógica para autenticación alternativa (por ejemplo, con contraseña)
                },
                child: Text('Iniciar sesión con contraseña'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
