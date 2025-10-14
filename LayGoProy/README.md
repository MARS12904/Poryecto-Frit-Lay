# LayGoProy - Aplicación de Tienda Móvil

Una aplicación de React Native desarrollada con Expo que implementa una tienda móvil completa con autenticación, catálogo de productos, carrito de compras, gestión de pedidos y sistema de pagos.

## 🚀 Características Implementadas

### 4.1 Módulo de Autenticación
- ✅ **Login** con usuario y contraseña
- ✅ **Autenticación biométrica** (huella dactilar)
- ✅ **Registro de usuario** con validaciones
- ✅ **Recuperación de contraseña**
- ✅ **Gestión de sesión** con AsyncStorage y SecureStore
- ✅ **Actualización de contraseña**

### 4.2 Módulo de Usuario/Perfil
- ✅ **Ver y editar información del perfil**
- ✅ **Subir foto de perfil** (con expo-image-picker)
- ✅ **Preferencias de usuario** (notificaciones, tema)
- ✅ **Gestión de datos personales**

### 4.3 Módulo Principal con Navegación
- ✅ **Navegación por tabs** (Inicio, Catálogo, Carrito, Pedidos, Perfil)
- ✅ **Catálogo de productos** con búsqueda y filtros
- ✅ **Carrito de compras** con gestión de cantidades
- ✅ **Historial de pedidos** con estados de seguimiento
- ✅ **Sistema de pagos** con múltiples métodos

## 🛠️ Tecnologías Utilizadas

- **React Native** con Expo
- **TypeScript** para tipado estático
- **Expo Router** para navegación
- **Context API** para estado global
- **AsyncStorage** para persistencia local
- **Expo SecureStore** para datos sensibles
- **Expo Image Picker** para selección de imágenes
- **Expo Local Authentication** para biometría
- **React Navigation** para navegación avanzada

## 📱 Estructura del Proyecto

```
app/
├── (tabs)/                 # Navegación principal por tabs
│   ├── index.tsx          # Pantalla de inicio
│   ├── catalog.tsx        # Catálogo de productos
│   ├── cart.tsx           # Carrito de compras
│   ├── orders.tsx         # Historial de pedidos
│   └── profile.tsx        # Perfil de usuario
├── auth/                  # Módulo de autenticación
│   ├── login.tsx          # Inicio de sesión
│   ├── register.tsx       # Registro de usuario
│   └── forgot-password.tsx # Recuperación de contraseña
├── profile/               # Gestión de perfil
│   ├── edit.tsx           # Editar perfil
│   └── change-password.tsx # Cambiar contraseña
├── payments/              # Sistema de pagos
│   └── index.tsx          # Métodos de pago
└── _layout.tsx            # Layout principal

contexts/                  # Contextos de estado global
├── AuthContext.tsx        # Contexto de autenticación
└── CartContext.tsx        # Contexto del carrito

components/                # Componentes reutilizables
└── AuthGuard.tsx          # Guard de autenticación
```

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd LayGoProy
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   # Crear archivo .env con tus configuraciones
   ```

4. **Ejecutar la aplicación**
   ```bash
   # Para Android
   npm run android
   
   # Para iOS
   npm run ios
   
   # Para desarrollo
   npm start
   ```

## 🔐 Credenciales de Prueba

Para probar la aplicación, puedes usar estas credenciales:

- **Email:** admin@test.com
- **Contraseña:** 123456

## 📋 Funcionalidades por Módulo

### Módulo de Autenticación
- Login con validación de campos
- Registro con validación de contraseñas
- Autenticación biométrica (si está disponible)
- Recuperación de contraseña por email
- Gestión segura de tokens

### Módulo de Perfil
- Visualización y edición de datos personales
- Selección de foto de perfil desde galería
- Configuración de preferencias
- Cambio de contraseña con validación

### Módulo de Catálogo
- Lista de productos con imágenes
- Búsqueda por nombre y descripción
- Filtros por categoría
- Agregar productos al carrito
- Gestión de stock

### Módulo de Carrito
- Visualización de productos agregados
- Modificación de cantidades
- Eliminación de productos
- Cálculo de totales
- Integración con sistema de pagos

### Módulo de Pedidos
- Historial completo de compras
- Estados de pedidos (pendiente, procesando, enviado, entregado)
- Filtros por estado
- Cancelación de pedidos pendientes
- Números de seguimiento

### Módulo de Pagos
- Múltiples métodos de pago
- Formulario de tarjeta de crédito
- Integración con PayPal, Apple Pay, Google Pay
- Validación de datos de pago
- Confirmación de transacciones

## 🎨 Diseño y UX

- **Diseño moderno** con Material Design
- **Navegación intuitiva** con tabs y stack navigation
- **Feedback visual** para todas las acciones
- **Validaciones en tiempo real**
- **Mensajes de error claros**
- **Loading states** para mejor UX

## 🔧 Configuración Adicional

### Permisos Requeridos
- **Cámara:** Para tomar fotos de perfil
- **Galería:** Para seleccionar imágenes
- **Biometría:** Para autenticación biométrica
- **Almacenamiento:** Para persistencia de datos

### Configuración de Expo
El archivo `app.json` incluye todos los plugins necesarios:
- expo-router
- expo-splash-screen
- expo-secure-store
- expo-image-picker
- expo-camera
- expo-local-authentication

## 📱 Compatibilidad

- **Android:** API 21+ (Android 5.0+)
- **iOS:** iOS 11.0+
- **Expo SDK:** 54.0.13
- **React Native:** 0.81.4

## 🚀 Próximas Mejoras

- [ ] Integración con APIs reales
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Sincronización de datos
- [ ] Analytics y métricas
- [ ] Tests unitarios e integración

## 📄 Licencia

Este proyecto está desarrollado para fines educativos y de demostración.

## 👨‍💻 Autor

Desarrollado como parte del proyecto final de React Native.

---

**Nota:** Esta aplicación es una demostración completa de los módulos requeridos para el avance del proyecto final. Todos los datos son simulados y las funcionalidades están implementadas para mostrar el flujo completo de una aplicación de tienda móvil.