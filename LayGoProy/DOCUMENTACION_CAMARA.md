# 📷 Documentación Completa - Funcionalidad de Cámara

## 📋 Tabla de Contenidos

1. [Resumen General](#resumen-general)
2. [Arquitectura y Componentes](#arquitectura-y-componentes)
3. [Componente CameraView](#componente-cameraview)
4. [Pantalla Dedicada de Cámara](#pantalla-dedicada-de-cámara)
5. [Integraciones](#integraciones)
6. [Configuración](#configuración)
7. [Dependencias](#dependencias)
8. [Permisos](#permisos)
9. [Estilos y Temas](#estilos-y-temas)
10. [Ejemplos de Uso](#ejemplos-de-uso)
11. [Características Técnicas](#características-técnicas)

---

## 📖 Resumen General

La aplicación **LayGoProy** implementa una funcionalidad completa de cámara utilizando `expo-camera` que permite a los usuarios:

- **Tomar fotos** para actualizar su foto de perfil
- **Capturar imágenes** desde cualquier parte de la aplicación
- **Cambiar entre cámara frontal y trasera**
- **Manejo automático de permisos** con interfaz de usuario amigable

### Características Principales

✅ Componente modal reutilizable (`CameraView`)  
✅ Pantalla dedicada de cámara (`app/camera/index.tsx`)  
✅ Integración en pantallas de perfil  
✅ Manejo robusto de permisos  
✅ Interfaz moderna y responsive  
✅ Soporte para cámara frontal y trasera  
✅ Calidad de imagen configurable  

---

## 🏗️ Arquitectura y Componentes

### Estructura de Archivos

```
LayGoProy/
├── components/
│   └── CameraView.tsx          # Componente modal reutilizable
├── app/
│   ├── camera/
│   │   └── index.tsx           # Pantalla dedicada de cámara
│   └── (tabs)/
│       └── profile.tsx         # Integración en perfil (tabs)
└── app/
    └── profile/
        └── index.tsx           # Integración en perfil (alternativa)
```

### Flujo de Funcionamiento

```
Usuario → Selecciona "Tomar Foto" 
    ↓
Solicita Permisos (si no están concedidos)
    ↓
Abre CameraView (modal) o Pantalla Dedicada
    ↓
Usuario toma foto
    ↓
onCapture recibe URI de la imagen
    ↓
Actualiza perfil o procesa imagen según contexto
```

---

## 🎯 Componente CameraView

### Ubicación
`components/CameraView.tsx`

### Propósito
Componente modal reutilizable que encapsula toda la funcionalidad de cámara, incluyendo:
- Gestión de permisos
- Vista previa de cámara
- Controles de captura
- Cambio de cámara (frontal/trasera)

### Código Completo

```tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../constants/theme';

interface CameraViewProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
  type?: 'photo' | 'profile';
}

export default function CameraView({
  visible,
  onClose,
  onCapture,
  type = 'photo',
}: CameraViewProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission]);

  const handleTakePicture = async () => {
    if (!cameraRef.current || !permission?.granted) {
      Alert.alert('Error', 'No tienes permisos para usar la cámara');
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        onCapture(photo.uri);
        onClose();
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto. Intenta nuevamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return null; // Aún cargando permisos
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color={Colors.light.primary} />
            <Text style={styles.permissionTitle}>Permisos de Cámara</Text>
            <Text style={styles.permissionText}>
              Necesitamos acceso a tu cámara para tomar fotos
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Conceder Permisos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.permissionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.permissionButtonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ExpoCameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.light.background} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {type === 'profile' ? 'Foto de Perfil' : 'Tomar Foto'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse" size={28} color={Colors.light.background} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={handleTakePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.flipButton} />
          </View>
        </ExpoCameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.background,
  },
  headerSpacer: {
    width: 40,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 4,
    borderColor: Colors.light.background,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.background,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  permissionText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    minWidth: 200,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: Colors.light.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    color: Colors.light.text,
  },
});
```

### Props del Componente

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `visible` | `boolean` | ✅ | Controla la visibilidad del modal |
| `onClose` | `() => void` | ✅ | Callback cuando se cierra el modal |
| `onCapture` | `(uri: string) => void` | ✅ | Callback cuando se captura una foto |
| `type` | `'photo' \| 'profile'` | ❌ | Tipo de captura (por defecto: `'photo'`) |

### Estados Internos

- `facing`: Tipo de cámara activa (`'back'` o `'front'`)
- `permission`: Estado de permisos de cámara
- `isCapturing`: Indica si se está capturando una foto
- `cameraRef`: Referencia al componente de cámara de Expo

### Funciones Principales

#### `handleTakePicture()`
Captura una foto con las siguientes características:
- **Calidad**: 0.8 (80%)
- **Formato**: URI de archivo (no base64)
- **Validaciones**: Verifica permisos y referencia de cámara
- **Manejo de errores**: Muestra alertas en caso de fallo

#### `toggleCameraFacing()`
Alterna entre cámara frontal y trasera.

#### `useEffect` para Permisos
Solicita permisos automáticamente cuando el modal se hace visible.

---

## 📱 Pantalla Dedicada de Cámara

### Ubicación
`app/camera/index.tsx`

### Propósito
Pantalla completa de cámara accesible mediante navegación, útil para casos donde se necesita una experiencia de cámara independiente.

### Código Completo

```tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleTakePicture = async () => {
    if (!cameraRef.current || !permission?.granted) {
      Alert.alert('Error', 'No tienes permisos para usar la cámara');
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        // Aquí puedes hacer algo con la foto
        // Por ejemplo, guardarla o pasarla a otra pantalla
        Alert.alert(
          'Foto Capturada',
          'La foto se ha capturado exitosamente',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto. Intenta nuevamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.light.primary} />
          <Text style={styles.permissionTitle}>Permisos de Cámara</Text>
          <Text style={styles.permissionText}>
            Necesitamos acceso a tu cámara para tomar fotos
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permisos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.permissionButton, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.permissionButtonText, styles.cancelButtonText]}>
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Colors.light.background} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cámara</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color={Colors.light.background} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={handleTakePicture}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.flipButton} />
        </View>
      </ExpoCameraView>
    </View>
  );
}

// Estilos similares a CameraView.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.background,
  },
  headerSpacer: {
    width: 40,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 4,
    borderColor: Colors.light.background,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.background,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  permissionText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    minWidth: 200,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: Colors.light.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    color: Colors.light.text,
  },
});
```

### Navegación

Para acceder a esta pantalla:

```tsx
import { router } from 'expo-router';

// Navegar a la cámara
router.push('/camera');
```

### Diferencias con CameraView

| Aspecto | CameraView | CameraScreen |
|---------|------------|--------------|
| **Tipo** | Modal | Pantalla completa |
| **Navegación** | `onClose()` callback | `router.back()` |
| **Uso** | Reutilizable en cualquier pantalla | Pantalla dedicada |
| **Cierre** | Controlado por `visible` prop | Controlado por navegación |

---

## 🔗 Integraciones

### 1. Integración en Perfil (Tabs)

**Archivo**: `app/(tabs)/profile.tsx`

#### Código de Integración

```tsx
import CameraView from '../../components/CameraView';
import { useState } from 'react';

export default function ProfileScreen() {
  const [showCamera, setShowCamera] = useState(false);

  /**
   * Maneja la selección de imagen de perfil
   * Muestra un diálogo con dos opciones:
   * 1. Tomar foto: Abre el componente CameraView
   * 2. Elegir de galería: Abre el selector de imágenes
   */
  const handleImagePicker = async () => {
    Alert.alert(
      'Seleccionar Foto',
      '¿Cómo deseas agregar tu foto?',
      [
        {
          text: 'Tomar Foto',
          onPress: () => setShowCamera(true),
        },
        {
          text: 'Elegir de Galería',
          onPress: async () => {
            // ... código de galería
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Procesa la foto capturada desde la cámara
   * Recibe la URI de la imagen y actualiza el perfil
   */
  const handleCameraCapture = async (uri: string) => {
    await updateProfile({ profileImage: uri });
  };

  return (
    <ScrollView>
      {/* ... resto del componente ... */}
      
      {/* Botón para cambiar foto de perfil */}
      <TouchableOpacity 
        style={styles.editImageButton} 
        onPress={handleImagePicker}
      >
        <Ionicons 
          name="camera" 
          size={responsive({ xs: 12, sm: 14, md: 16 })} 
          color={Colors.light.background} 
        />
      </TouchableOpacity>

      {/* Componente de cámara */}
      <CameraView
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        type="profile"
      />
    </ScrollView>
  );
}
```

#### Flujo de Usuario

1. Usuario toca el ícono de cámara en la foto de perfil
2. Se muestra un `Alert` con opciones:
   - **"Tomar Foto"** → Abre `CameraView` modal
   - **"Elegir de Galería"** → Abre selector de imágenes
   - **"Cancelar"** → Cierra el diálogo
3. Si selecciona "Tomar Foto":
   - Se establece `showCamera = true`
   - Se abre el modal `CameraView`
   - Usuario toma la foto
   - `onCapture` recibe la URI
   - Se actualiza el perfil con `updateProfile()`
   - El modal se cierra automáticamente

### 2. Integración en Perfil (Alternativa)

**Archivo**: `app/profile/index.tsx`

Similar a la integración anterior, pero con una estructura de pantalla diferente. El código de integración es idéntico en cuanto a la funcionalidad de cámara.

---

## ⚙️ Configuración

### app.json

La configuración de permisos y plugins se encuentra en `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "La app necesita acceso a tu cámara para tomar fotos de productos y perfil."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "La app necesita acceso a tus fotos para que puedas seleccionar una imagen de perfil."
        }
      ]
    ]
  }
}
```

### Configuración de Permisos

#### iOS (Info.plist)
Los permisos se configuran automáticamente mediante el plugin `expo-camera`. El mensaje configurado se muestra cuando se solicitan permisos por primera vez.

#### Android (AndroidManifest.xml)
Los permisos se agregan automáticamente durante el build. El mensaje se muestra en el diálogo de permisos del sistema.

---

## 📦 Dependencias

### package.json

```json
{
  "dependencies": {
    "expo-camera": "~17.0.9",
    "expo-image-picker": "^17.0.8",
    "@expo/vector-icons": "^15.0.2"
  }
}
```

### Instalación

```bash
# Instalar expo-camera
npx expo install expo-camera

# Instalar expo-image-picker (para galería)
npx expo install expo-image-picker
```

### Versiones

- **expo-camera**: `~17.0.9` (compatible con Expo SDK 54)
- **expo-image-picker**: `^17.0.8` (para selección de galería)
- **@expo/vector-icons**: `^15.0.2` (para iconos)

---

## 🔐 Permisos

### Permisos de Cámara

#### Solicitud Automática
Los permisos se solicitan automáticamente cuando:
1. El componente `CameraView` se hace visible
2. El usuario intenta tomar una foto
3. Se accede a la pantalla dedicada de cámara

#### Manejo de Permisos

```tsx
const [permission, requestPermission] = useCameraPermissions();

// Verificar estado
if (!permission) {
  // Cargando...
}

if (!permission.granted) {
  // Mostrar UI de solicitud de permisos
  // Botón para solicitar permisos
}

if (permission.granted) {
  // Mostrar cámara
}
```

#### Estados de Permisos

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `null` | Cargando permisos | Mostrar loading |
| `granted: false` | Permisos denegados | Mostrar UI de solicitud |
| `granted: true` | Permisos concedidos | Mostrar cámara |

### Permisos de Galería

Los permisos de galería se solicitan cuando el usuario selecciona "Elegir de Galería":

```tsx
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
  return;
}
```

---

## 🎨 Estilos y Temas

### Constantes de Tema

Los estilos utilizan constantes del archivo `constants/theme.ts`:

```tsx
import { 
  Colors, 
  Spacing, 
  FontSizes, 
  BorderRadius, 
  Shadows 
} from '../constants/theme';
```

### Colores Utilizados

| Constante | Valor | Uso |
|-----------|-------|-----|
| `Colors.light.primary` | `#E31E24` | Botones principales, iconos |
| `Colors.light.background` | `#ffffff` | Fondos, texto en botones |
| `Colors.light.text` | `#1a1a1a` | Texto principal |
| `Colors.light.textSecondary` | `#666666` | Texto secundario |
| `Colors.light.border` | `#e0e0e0` | Bordes |

### Espaciado

| Constante | Valores Responsive |
|-----------|-------------------|
| `Spacing.xs` | 2-8px |
| `Spacing.sm` | 4-16px |
| `Spacing.md` | 8-24px |
| `Spacing.lg` | 12-32px |
| `Spacing.xl` | 16-40px |
| `Spacing.xxl` | 24-56px |

### Tamaños de Fuente

| Constante | Valores Responsive |
|-----------|-------------------|
| `FontSizes.md` | 14-18px |
| `FontSizes.lg` | 16-22px |
| `FontSizes.xxl` | 20-28px |

### Bordes y Sombras

- **BorderRadius.full**: `9999` (botones circulares)
- **BorderRadius.md**: `8` (botones de permisos)
- **Shadows.lg**: Sombra grande para botón de captura

### Elementos de UI

#### Botón de Captura
- **Tamaño**: 80x80px
- **Borde**: 4px blanco
- **Círculo interno**: 64x64px blanco
- **Estado deshabilitado**: Opacidad 0.5

#### Botón de Voltear Cámara
- **Tamaño**: 56x56px
- **Fondo**: `rgba(255, 255, 255, 0.3)`
- **Icono**: `camera-reverse` de Ionicons

#### Header y Controles
- **Fondo**: `rgba(0, 0, 0, 0.3)` (semi-transparente)
- **Padding**: Responsive según plataforma (iOS tiene más padding superior)

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Uso Básico del Componente

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import CameraView from './components/CameraView';

export default function MiPantalla() {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (uri: string) => {
    console.log('Foto capturada:', uri);
    // Procesar la imagen
  };

  return (
    <View>
      <Button 
        title="Abrir Cámara" 
        onPress={() => setShowCamera(true)} 
      />
      
      <CameraView
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
        type="photo"
      />
    </View>
  );
}
```

### Ejemplo 2: Actualizar Foto de Perfil

```tsx
import { useAuth } from '../contexts/AuthContext';
import CameraView from '../components/CameraView';

function ProfilePhotoEditor() {
  const { updateProfile } = useAuth();
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = async (uri: string) => {
    await updateProfile({ profileImage: uri });
    // La foto se actualiza automáticamente
  };

  return (
    <CameraView
      visible={showCamera}
      onClose={() => setShowCamera(false)}
      onCapture={handleCapture}
      type="profile"
    />
  );
}
```

### Ejemplo 3: Navegar a Pantalla Dedicada

```tsx
import { router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

function MiComponente() {
  const openCamera = () => {
    router.push('/camera');
  };

  return (
    <TouchableOpacity onPress={openCamera}>
      <Text>Abrir Cámara</Text>
    </TouchableOpacity>
  );
}
```

### Ejemplo 4: Captura con Procesamiento Personalizado

```tsx
import * as FileSystem from 'expo-file-system';

const handleCapture = async (uri: string) => {
  // Leer la imagen como base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Subir a servidor
  await uploadImage(base64);

  // Guardar localmente
  await saveImageLocally(uri);
};
```

---

## 🔧 Características Técnicas

### Calidad de Imagen

```tsx
const photo = await cameraRef.current.takePictureAsync({
  quality: 0.8,      // 80% de calidad (balance entre tamaño y calidad)
  base64: false,      // No incluir base64 (solo URI)
});
```

**Opciones disponibles:**
- `quality`: `0.0` - `1.0` (0.8 por defecto)
- `base64`: `true` | `false` (false por defecto)
- `skipProcessing`: `true` | `false` (para iOS, omite procesamiento)

### Tipos de Cámara

```tsx
type CameraType = 'back' | 'front';

const [facing, setFacing] = useState<CameraType>('back');
```

- **`'back'`**: Cámara trasera (por defecto)
- **`'front'`**: Cámara frontal

### Manejo de Errores

```tsx
try {
  setIsCapturing(true);
  const photo = await cameraRef.current.takePictureAsync({...});
  
  if (photo?.uri) {
    onCapture(photo.uri);
    onClose();
  }
} catch (error) {
  console.error('Error tomando foto:', error);
  Alert.alert('Error', 'No se pudo tomar la foto. Intenta nuevamente.');
} finally {
  setIsCapturing(false);
}
```

### Estados de Carga

El componente maneja tres estados principales:

1. **Cargando permisos**: `permission === null`
2. **Sin permisos**: `permission.granted === false`
3. **Listo**: `permission.granted === true`

### Compatibilidad

#### iOS
- **Versión mínima**: iOS 11.0+
- **Permisos**: Requiere `NSCameraUsageDescription` en Info.plist (automático con expo-camera)

#### Android
- **Versión mínima**: Android 5.0+ (API 21+)
- **Permisos**: `CAMERA` y `WRITE_EXTERNAL_STORAGE` (automático con expo-camera)

#### Web
- **Limitado**: La cámara funciona pero con limitaciones en navegadores
- **Recomendado**: Usar en dispositivos móviles

### Limitaciones

1. **Emuladores**: La cámara no funciona en emuladores, solo en dispositivos físicos
2. **Web**: Funcionalidad limitada en navegadores web
3. **Permisos**: Requiere permisos explícitos del usuario
4. **Almacenamiento**: Las fotos se guardan temporalmente, requiere procesamiento adicional para persistencia

---

## 🐛 Solución de Problemas

### Problema: La cámara no se abre

**Solución:**
1. Verificar que `expo-camera` esté instalado: `npx expo install expo-camera`
2. Verificar permisos en configuración del dispositivo
3. Asegurarse de usar un dispositivo físico (no emulador)
4. Reiniciar la aplicación

### Problema: Error de permisos

**Solución:**
1. Ir a Configuración del dispositivo
2. Buscar la aplicación
3. Habilitar permisos de cámara manualmente
4. Reiniciar la aplicación

### Problema: La foto no se guarda

**Solución:**
1. Verificar que `onCapture` esté manejando correctamente el URI
2. Revisar la consola para errores
3. Verificar permisos de almacenamiento (Android)
4. Verificar espacio disponible en el dispositivo

### Problema: La cámara está invertida

**Solución:**
- Esto es normal en la cámara frontal
- El componente maneja la orientación automáticamente
- Las fotos capturadas se guardan con la orientación correcta

### Problema: Performance lenta

**Solución:**
1. Reducir calidad de imagen: `quality: 0.6`
2. Deshabilitar base64 si no se necesita
3. Optimizar procesamiento de imagen después de captura

---

## 📚 Referencias

### Documentación Oficial

- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [React Native Modal](https://reactnative.dev/docs/modal)

### Recursos Adicionales

- [Expo Camera API Reference](https://docs.expo.dev/versions/latest/sdk/camera/#cameraview)
- [Camera Permissions Guide](https://docs.expo.dev/guides/permissions/)
- [Image Processing Best Practices](https://docs.expo.dev/guides/image-manipulation/)

---

## 📝 Notas Finales

### Mejoras Futuras Sugeridas

1. **Vista previa antes de guardar**: Mostrar preview de la foto antes de confirmar
2. **Filtros y efectos**: Agregar filtros básicos a las fotos
3. **Recorte de imagen**: Permitir recortar la imagen antes de guardar
4. **Múltiples fotos**: Soporte para capturar múltiples fotos en secuencia
5. **Grabación de video**: Extender funcionalidad para grabar videos
6. **Zoom**: Agregar gestos de zoom en la cámara
7. **Flash**: Control de flash/torch
8. **HDR**: Soporte para modo HDR

### Consideraciones de Seguridad

1. **Permisos**: Siempre solicitar permisos explícitamente
2. **Almacenamiento**: No almacenar fotos sensibles sin encriptación
3. **Privacidad**: Informar al usuario sobre el uso de las fotos
4. **Limpieza**: Eliminar fotos temporales después de procesarlas

---

**Última actualización**: Diciembre 2024  
**Versión del documento**: 1.0.0  
**Autor**: Equipo de Desarrollo LayGoProy


