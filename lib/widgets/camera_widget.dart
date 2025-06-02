import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

class CameraWidget extends StatefulWidget {
  final List<CameraDescription> cameras;
  final Function(String) onImageCaptured;

  const CameraWidget({
    Key? key,
    required this.cameras,
    required this.onImageCaptured,
  }) : super(key: key);

  @override
  _CameraWidgetState createState() => _CameraWidgetState();
}

class _CameraWidgetState extends State<CameraWidget> {
  CameraController? _controller;
  bool _isInitialized = false;
  bool _isCapturing = false;
  String? _capturedImagePath;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    if (widget.cameras.isEmpty) return;

    // Usar la cámara frontal si está disponible
    CameraDescription camera = widget.cameras.first;
    for (var cam in widget.cameras) {
      if (cam.lensDirection == CameraLensDirection.front) {
        camera = cam;
        break;
      }
    }

    _controller = CameraController(
      camera,
      ResolutionPreset.medium,
      enableAudio: false,
    );

    try {
      await _controller!.initialize();
      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      print('Error initializing camera: $e');
    }
  }

  Future<void> _captureImage() async {
    if (_controller == null || !_controller!.value.isInitialized) return;

    try {
      setState(() => _isCapturing = true);

      final Directory tempDir = await getTemporaryDirectory();
      final String fileName = 'face_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final String filePath = path.join(tempDir.path, fileName);

      final XFile image = await _controller!.takePicture();
      await image.saveTo(filePath);

      setState(() {
        _capturedImagePath = filePath;
        _isCapturing = false;
      });

      widget.onImageCaptured(filePath);
    } catch (e) {
      setState(() => _isCapturing = false);
      print('Error capturing image: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error capturando imagen: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _retakePhoto() {
    setState(() {
      _capturedImagePath = null;
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Inicializando cámara...'),
          ],
        ),
      );
    }

    return Column(
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: _capturedImagePath != null
                  ? Stack(
                      children: [
                        Image.file(
                          File(_capturedImagePath!),
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                        ),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            padding: EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.green,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Icon(
                              Icons.check,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    )
                  : Stack(
                      children: [
                        CameraPreview(_controller!),
                        // Overlay guide
                        Center(
                          child: Container(
                            width: 200,
                            height: 250,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.white,
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                'Posiciona tu rostro aquí',
                                style: TextStyle(
                                  color: Colors.white,
                                  backgroundColor: Colors.black54,
                                  fontSize: 12,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            if (_capturedImagePath == null) ...[
              ElevatedButton.icon(
                onPressed: _isCapturing ? null : _captureImage,
                icon: _isCapturing
                    ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Icon(Icons.camera_alt),
                label: Text(_isCapturing ? 'Capturando...' : 'Capturar'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                ),
              ),
            ] else ...[
              ElevatedButton.icon(
                onPressed: _retakePhoto,
                icon: Icon(Icons.refresh),
                label: Text('Repetir'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey[600],
                  foregroundColor: Colors.white,
                ),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // La imagen ya fue enviada via callback
                },
                icon: Icon(Icons.check),
                label: Text('Usar Foto'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
