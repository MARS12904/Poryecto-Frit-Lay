# 📷 Guía de Funcionalidad de Cámara

## ✅ Implementación Completada

Se ha agregado funcionalidad completa de cámara a tu aplicación usando `expo-camera`.

## 🎯 Características Implementadas

### 1. Componente de Cámara Reutilizable
- **Archivo:** `components/CameraView.tsx`
- Componente modal que se puede usar en cualquier parte de la app
- Soporta cámara frontal y trasera
- Manejo de permisos automático
- Interfaz moderna con controles intuitivos

### 2. Pantalla de Cámara Dedicada
- **Archivo:** `app/camera/index.tsx`
- Pantalla completa para tomar fotos
- Accesible desde cualquier parte de la app
- Navegación con `router.push('/camera')`

### 3. Integración en Perfil
- **Archivos actualizados:**
  - `app/profile/index.tsx`
  - `app/(tabs)/profile.tsx`
- Opción para tomar foto con cámara o seleccionar de galería
- Actualización automática de foto de perfil

## 🚀 Cómo Usar

### Opción 1: Desde el Perfil

1. Ve a la pantalla de Perfil
2. Toca el ícono de cámara en la foto de perfil
3. Selecciona:
   - **"Tomar Foto"** - Abre la cámara
   - **"Elegir de Galería"** - Abre la galería
4. La foto se actualizará automáticamente

### Opción 2: Pantalla Dedicada de Cámara

```tsx
import { router } from 'expo-router';

// Navegar a la cámara
router.push('/camera');
```

### Opción 3: Usar el Componente CameraView

```tsx
import CameraView from '../components/CameraView';
import { useState } from 'react';

function MiComponente() {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (uri: string) => {
    // Hacer algo con la foto
    console.log('Foto capturada:', uri);
  };

  return (
    <>
      <Button onPress={() => setShowCamera(true)} title="Abrir Cámara" />
      
      <CameraView
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
        type="photo" // o "profile"
      />
    </>
  );
}
```

## 🔧 Configuración

### Permisos

Los permisos están configurados en `app.json`:

```json
[
  "expo-camera",
  {
    "cameraPermission": "La app necesita acceso a tu cámara para tomar fotos de productos y perfil."
  }
]
```

### Permisos de Galería

Los permisos de galería se solicitan automáticamente cuando el usuario intenta seleccionar una imagen.

## 📱 Características de la Cámara

- ✅ **Cambio de cámara:** Frontal/Trasera
- ✅ **Captura de foto:** Botón grande y fácil de usar
- ✅ **Manejo de permisos:** Solicita permisos automáticamente
- ✅ **Interfaz moderna:** Diseño limpio con controles intuitivos
- ✅ **Calidad configurable:** Fotos con calidad 0.8 (80%)
- ✅ **Recorte:** Las fotos de perfil se recortan a 1:1

## 🎨 Personalización

### Cambiar el tipo de cámara por defecto

En `CameraView.tsx`:

```tsx
const [facing, setFacing] = useState<CameraType>('front'); // Cambiar a 'front'
```

### Cambiar la calidad de la foto

En `CameraView.tsx`:

```tsx
const photo = await cameraRef.current.takePictureAsync({
  quality: 1.0, // Cambiar de 0.8 a 1.0 para máxima calidad
  base64: false,
});
```

## ⚠️ Notas Importantes

1. **Dispositivos físicos:** La cámara solo funciona en dispositivos físicos, no en emuladores
2. **Permisos:** La primera vez que uses la cámara, se solicitarán permisos
3. **iOS:** Requiere iOS 11.0+
4. **Android:** Requiere Android 5.0+ (API 21+)

## 🐛 Solución de Problemas

### La cámara no se abre

1. Verifica que `expo-camera` esté instalado: `npx expo install expo-camera`
2. Verifica los permisos en la configuración del dispositivo
3. Asegúrate de estar usando un dispositivo físico (no emulador)

### Error de permisos

1. Ve a Configuración del dispositivo
2. Busca tu app
3. Habilita los permisos de cámara manualmente

### La foto no se guarda

1. Verifica que la función `onCapture` esté manejando correctamente el URI
2. Revisa la consola para ver si hay errores
3. Asegúrate de que el usuario tenga permisos de almacenamiento

## 📚 Documentación

- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

