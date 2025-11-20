# 📱 Guía Completa de Funcionalidades - Frito-Lay Comerciantes

## 🚀 Accesos Rápidos a Archivos

### 📁 Archivos Principales por Funcionalidad

#### 🔐 Autenticación
- **Login:** [`app/auth/login.tsx`](#login-con-email-y-contraseña)
- **Registro:** [`app/auth/register.tsx`](#registro-de-usuario)
- **Recuperación:** [`app/auth/forgot-password.tsx`](#recuperación-de-contraseña)
- **Contexto Auth:** [`contexts/AuthContext.tsx`](#módulo-de-autenticación)
- **Guard:** [`components/AuthGuard.tsx`](#módulo-de-autenticación)

#### 👤 Perfil
- **Perfil Principal:** [`app/(tabs)/profile.tsx`](#visualización-de-perfil)
- **Editar Perfil:** [`app/profile/edit.tsx`](#editar-información-personal)
- **Cambiar Contraseña:** [`app/profile/change-password.tsx`](#cambio-de-contraseña)

#### 🛍️ Catálogo y Productos
- **Catálogo:** [`app/(tabs)/catalog.tsx`](#módulo-de-catálogo-de-productos)
- **Datos Productos:** [`data/products.ts`](#visualización-de-productos)
- **Imagen Producto:** [`components/ProductImage.tsx`](#visualización-de-productos)

#### 🛒 Carrito
- **Pantalla Carrito:** [`app/(tabs)/cart.tsx`](#módulo-de-carrito-de-compras)
- **Contexto Carrito:** [`contexts/CartContext.tsx`](#módulo-de-carrito-de-compras)
- **Programador Entrega:** [`components/DeliveryScheduler.tsx`](#programación-de-entrega)

#### 📦 Pedidos
- **Pantalla Pedidos:** [`app/(tabs)/orders.tsx`](#módulo-de-pedidos)
- **Contexto Pedidos:** [`contexts/OrdersContext.tsx`](#crear-nuevo-pedido)

#### 💳 Pagos
- **Pantalla Pagos:** [`app/payments/index.tsx`](#módulo-de-pagos)
- **Configuración:** [`constants/payments.ts`](#selección-de-método-de-pago)

#### 🔔 Notificaciones
- **Utilidades:** [`utils/native-notifications.ts`](#sistema-de-notificaciones)
- **Hook:** [`hooks/use-native-notifications.ts`](#sistema-de-notificaciones)

#### 📷 Cámara
- **Componente:** [`components/CameraView.tsx`](#componente-de-cámara-reutilizable)
- **Pantalla:** [`app/camera/index.tsx`](#pantalla-dedicada-de-cámara)

#### 📊 Stock y Métricas
- **Contexto Stock:** [`contexts/StockContext.tsx`](#gestión-de-stock)
- **Contexto Métricas:** [`contexts/MetricsContext.tsx`](#métricas-y-estadísticas)

#### 🎨 Tema y Estilos
- **Tema:** [`constants/theme.ts`](#sistema-de-tema-y-estilos)
- **Layout Responsive:** [`components/ResponsiveLayout.tsx`](#diseño-responsive)

#### 🏗️ Configuración
- **Layout Principal:** [`app/_layout.tsx`](#archivo-principal-app_layouttsx)
- **Navegación Tabs:** [`app/(tabs)/_layout.tsx`](#navegación-principal-apptabslayouttsx)
- **Configuración Expo:** [`app.json`](#configuración-expo)

---

## 📋 Tabla de Contenidos

1. [Estructura General de la Aplicación](#estructura-general-de-la-aplicación)
2. [Módulo de Autenticación](#módulo-de-autenticación)
3. [Módulo de Perfil de Usuario](#módulo-de-perfil-de-usuario)
4. [Módulo de Catálogo de Productos](#módulo-de-catálogo-de-productos)
5. [Módulo de Carrito de Compras](#módulo-de-carrito-de-compras)
6. [Módulo de Pedidos](#módulo-de-pedidos)
7. [Módulo de Pagos](#módulo-de-pagos)
8. [Sistema de Notificaciones](#sistema-de-notificaciones)
9. [Sistema de Cámara](#sistema-de-cámara)
10. [Gestión de Stock](#gestión-de-stock)
11. [Métricas y Estadísticas](#métricas-y-estadísticas)
12. [Sistema de Tema y Estilos](#sistema-de-tema-y-estilos)
13. [Flujos Principales](#flujos-principales-de-la-aplicación)
14. [Estructura de Archivos](#estructura-de-archivos-por-funcionalidad)

---

## 🏗️ Estructura General de la Aplicación

### Archivo Principal: `app/_layout.tsx`
**📂 Ubicación:** `LayGoProy/app/_layout.tsx`  
**🔗 Ruta completa:** `app/_layout.tsx`

**Función:** Configuración global de la aplicación
- Inicializa todos los Context Providers (Auth, Cart, Orders, Stock, Metrics)
- Configura el tema (claro/oscuro)
- Inicializa el sistema de notificaciones
- Define la estructura de navegación principal

**Contextos Inicializados:**
```typescript
<AuthProvider>          // Autenticación y usuarios
  <StockProvider>       // Gestión de inventario
    <OrdersProvider>    // Gestión de pedidos
      <MetricsProvider> // Métricas y estadísticas
        <CartProvider>  // Carrito de compras
```

### Navegación Principal: `app/(tabs)/_layout.tsx`
**Ubicación:** `LayGoProy/app/(tabs)/_layout.tsx`

**Función:** Configuración de la navegación por tabs
- Define las 5 pestañas principales: Inicio, Catálogo, Carrito, Pedidos, Perfil
- Configura iconos y badges (contador de items en carrito)
- Aplica colores del tema corporativo de Frito-Lay

---

## 🔐 Módulo de Autenticación

### Archivos Principales:
- **Contexto:** `contexts/AuthContext.tsx`
- **Pantalla de Login:** `app/auth/login.tsx`
- **Pantalla de Registro:** `app/auth/register.tsx`
- **Recuperación de Contraseña:** `app/auth/forgot-password.tsx`
- **Guard de Autenticación:** `components/AuthGuard.tsx`

### Funcionalidades Implementadas:

#### 1. **Login con Email y Contraseña**
**Ubicación:** `app/auth/login.tsx` → `handleLogin()`
**Contexto:** `contexts/AuthContext.tsx` → `login()`

**Cómo funciona:**
1. Usuario ingresa email y contraseña
2. Se valida que los campos no estén vacíos
3. Se llama a `login(email, password)` del AuthContext
4. AuthContext busca el usuario en `data/userStorage.ts`
5. Verifica la contraseña (almacenada en SecureStore)
6. Si es correcto, guarda la sesión y navega a `/(tabs)`
7. Si falla, muestra alerta de error

**Almacenamiento:**
- Sesión: `SecureStore` (encriptado)
- Datos de usuario: `AsyncStorage`

#### 2. **Autenticación Biométrica**
**Ubicación:** `app/auth/login.tsx` → `handleBiometricLogin()`
**Contexto:** `contexts/AuthContext.tsx` → `biometricLogin()`

**Cómo funciona:**
1. Usuario presiona el botón de huella dactilar
2. Se llama a `expo-local-authentication`
3. Si la biometría es exitosa, recupera las credenciales guardadas
4. Inicia sesión automáticamente

**Librería:** `expo-local-authentication`

#### 3. **Registro de Usuario**
**Ubicación:** `app/auth/register.tsx`
**Contexto:** `contexts/AuthContext.tsx` → `register()`

**Cómo funciona:**
1. Usuario completa formulario (nombre, email, teléfono, contraseña)
2. Se valida que las contraseñas coincidan
3. Se verifica que el email no esté registrado
4. Se crea el usuario en `data/userStorage.ts`
5. Se guarda la contraseña en `SecureStore` (encriptada)
6. Se inicia sesión automáticamente

**Validaciones:**
- Email válido
- Contraseña mínimo 6 caracteres
- Confirmación de contraseña debe coincidir

#### 4. **Recuperación de Contraseña**
**Ubicación:** `app/auth/forgot-password.tsx`
**Contexto:** `contexts/AuthContext.tsx` → `forgotPassword()`

**Cómo funciona:**
1. Usuario ingresa su email
2. Se busca el usuario en el sistema
3. Se muestra mensaje de confirmación (simulado)
4. En producción, se enviaría un email con link de recuperación

#### 5. **Cambio de Contraseña**
**Ubicación:** `app/profile/change-password.tsx`
**Contexto:** `contexts/AuthContext.tsx` → `changePassword()`

**Cómo funciona:**
1. Usuario ingresa contraseña actual y nueva
2. Se valida la contraseña actual
3. Se actualiza en `SecureStore`
4. Se muestra confirmación

---

## 👤 Módulo de Perfil de Usuario

### Archivos Principales:
- **Pantalla Principal:** `app/(tabs)/profile.tsx` y `app/profile/index.tsx`
- **Editar Perfil:** `app/profile/edit.tsx`
- **Cambiar Contraseña:** `app/profile/change-password.tsx`
- **Contexto:** `contexts/AuthContext.tsx` → `updateProfile()`

### Funcionalidades Implementadas:

#### 1. **Visualización de Perfil**
**Ubicación:** `app/(tabs)/profile.tsx`

**Muestra:**
- Foto de perfil (o ícono por defecto)
- Nombre y email del usuario
- Estadísticas del comerciante (pedidos, gastos, ahorros)
- Métricas mensuales
- Productos más comprados
- Actividad reciente

#### 2. **Editar Información Personal**
**Ubicación:** `app/profile/edit.tsx`
**Contexto:** `contexts/AuthContext.tsx` → `updateProfile()`

**Cómo funciona:**
1. Usuario modifica campos (nombre, teléfono, etc.)
2. Se valida la información
3. Se actualiza en `data/userStorage.ts`
4. Se guarda en `AsyncStorage` para persistencia
5. Se actualiza el estado global del usuario

#### 3. **Subir Foto de Perfil**
**Ubicación:** `app/(tabs)/profile.tsx` → `handleImagePicker()`

**Opciones:**
- **Tomar Foto:** Abre `components/CameraView.tsx` (cámara nativa)
- **Elegir de Galería:** Usa `expo-image-picker`

**Cómo funciona:**
1. Usuario toca el ícono de cámara en la foto de perfil
2. Aparece menú con opciones: "Tomar Foto" o "Elegir de Galería"
3. Si toma foto: se abre modal de cámara (`CameraView`)
4. Si elige galería: se abre selector de imágenes
5. Se actualiza `user.profileImage` con el URI de la imagen
6. Se guarda en el perfil del usuario

**Librerías:**
- `expo-camera` para tomar fotos
- `expo-image-picker` para seleccionar de galería

#### 4. **Preferencias de Usuario**
**Ubicación:** `app/(tabs)/profile.tsx` → `handleNotificationToggle()`

**Configuraciones:**
- Notificaciones (on/off)
- Tema (claro/oscuro/auto) - pendiente de implementar

**Cómo funciona:**
1. Usuario cambia el switch de notificaciones
2. Se actualiza `user.preferences.notifications`
3. Se guarda en el perfil
4. Afecta si se muestran notificaciones o no

---

## 🛍️ Módulo de Catálogo de Productos

### Archivos Principales:
- **Pantalla:** `app/(tabs)/catalog.tsx`
- **Datos:** `data/products.ts`
- **Componente de Imagen:** `components/ProductImage.tsx`
- **Contextos:** `CartContext.tsx`, `StockContext.tsx`

### Funcionalidades Implementadas:

#### 1. **Visualización de Productos**
**Ubicación:** `app/(tabs)/catalog.tsx` → `renderProduct()`

**Muestra:**
- Imagen del producto
- Nombre y marca
- Precio regular y precio mayorista
- Stock disponible
- Categoría
- Botón para agregar al carrito

**Datos:** Cargados desde `data/products.ts`

#### 2. **Búsqueda de Productos**
**Ubicación:** `app/(tabs)/catalog.tsx` → `useEffect()` con `searchQuery`
**Función:** `data/products.ts` → `searchProducts()`

**Cómo funciona:**
1. Usuario escribe en el campo de búsqueda
2. Se filtra por nombre y descripción del producto
3. Se actualiza la lista en tiempo real
4. Búsqueda case-insensitive

**Código:**
```typescript
if (searchQuery) {
  filtered = searchProducts(searchQuery);
}
```

#### 3. **Filtrado por Categoría**
**Ubicación:** `app/(tabs)/catalog.tsx` → `useEffect()` con `selectedCategory`
**Función:** `data/products.ts` → `getProductsByCategory()`

**Cómo funciona:**
1. Usuario selecciona una categoría del filtro horizontal
2. Se filtran los productos por esa categoría
3. Opción "Todos" muestra todos los productos

**Categorías disponibles:**
- Todos
- Papas Fritas
- Snacks
- Bebidas
- etc. (definidas en `data/products.ts`)

#### 4. **Agregar Producto al Carrito**
**Ubicación:** `app/(tabs)/catalog.tsx` → `handleAddToCart()`
**Contexto:** `contexts/CartContext.tsx` → `addToCart()`

**Cómo funciona:**
1. Usuario presiona "Agregar al Carrito"
2. Se verifica disponibilidad de stock (`StockContext`)
3. **Modo Minorista:** Agrega 1 unidad directamente
4. **Modo Mayorista:** Abre modal para seleccionar cantidad
5. Se valida cantidad mínima (para mayoristas)
6. Se reduce el stock (`StockContext.reduceStock()`)
7. Se agrega al carrito con precio según modo (mayorista/regular)
8. Se muestra alerta de confirmación

**Validaciones:**
- Producto disponible
- Stock suficiente
- Cantidad mínima (modo mayorista)
- Cantidad máxima

---

## 🛒 Módulo de Carrito de Compras

### Archivos Principales:
- **Pantalla:** `app/(tabs)/cart.tsx`
- **Contexto:** `contexts/CartContext.tsx`
- **Componente:** `components/DeliveryScheduler.tsx`

### Funcionalidades Implementadas:

#### 1. **Visualización del Carrito**
**Ubicación:** `app/(tabs)/cart.tsx` → `renderCartItem()`

**Muestra:**
- Imagen del producto
- Nombre y precio
- Cantidad actual
- Subtotal por producto
- Botones para modificar cantidad
- Botón para eliminar

**Datos:** Vienen de `CartContext.items`

#### 2. **Modificar Cantidad**
**Ubicación:** `app/(tabs)/cart.tsx` → `handleQuantityChange()`
**Contexto:** `contexts/CartContext.tsx` → `updateQuantity()`

**Cómo funciona:**
1. Usuario presiona botones +/- o ingresa cantidad manualmente
2. Se valida cantidad mínima y máxima del producto
3. Se calcula la diferencia (delta) con cantidad anterior
4. Si aumenta: se reduce stock adicional
5. Si disminuye: se aumenta stock (devuelve al inventario)
6. Se actualiza el subtotal del item
7. Se recalcula el total del carrito

**Persistencia:** Se guarda automáticamente en `AsyncStorage`

#### 3. **Eliminar Producto del Carrito**
**Ubicación:** `app/(tabs)/cart.tsx` → `handleRemoveItem()`
**Contexto:** `contexts/CartContext.tsx` → `removeFromCart()`

**Cómo funciona:**
1. Usuario presiona botón eliminar
2. Se muestra confirmación
3. Se devuelve el stock al inventario
4. Se elimina el item del carrito
5. Se actualiza el total

#### 4. **Vaciar Carrito**
**Ubicación:** `app/(tabs)/cart.tsx` → `handleClearCart()`
**Contexto:** `contexts/CartContext.tsx` → `clearCart()`

**Cómo funciona:**
1. Usuario presiona "Vaciar Carrito"
2. Se muestra confirmación
3. Se devuelve todo el stock al inventario
4. Se limpia el array de items
5. Se resetea el total

#### 5. **Modo Mayorista vs Minorista**
**Ubicación:** `app/(tabs)/index.tsx` → `handleWholesaleToggle()`
**Contexto:** `contexts/CartContext.tsx` → `toggleWholesaleMode()`

**Cómo funciona:**
1. Usuario cambia el switch en la pantalla de inicio
2. Se actualiza `isWholesaleMode` en CartContext
3. Se recalculan todos los precios en el carrito:
   - **Mayorista:** Usa `product.wholesalePrice`
   - **Minorista:** Usa `product.price`
4. Se actualizan los subtotales de cada item
5. Se muestra el ahorro generado

**Beneficios modo mayorista:**
- Precios más bajos
- Requiere programación de entrega
- Cantidades mínimas por producto

#### 6. **Programación de Entrega**
**Ubicación:** `app/(tabs)/cart.tsx` → `DeliveryScheduler`
**Componente:** `components/DeliveryScheduler.tsx`

**Cómo funciona:**
1. En modo mayorista, se requiere programar entrega
2. Usuario selecciona fecha, horario y dirección
3. Se guarda en `CartContext.deliverySchedule`
4. Se agrega costo de envío al total (S/ 15.00)
5. Es obligatorio antes de proceder al pago

---

## 📦 Módulo de Pedidos

### Archivos Principales:
- **Pantalla:** `app/(tabs)/orders.tsx`
- **Contexto:** `contexts/OrdersContext.tsx`
- **Notificaciones:** Integrado en `OrdersContext.updateOrderStatus()`

### Funcionalidades Implementadas:

#### 1. **Visualización de Pedidos**
**Ubicación:** `app/(tabs)/orders.tsx` → `renderOrder()`

**Muestra:**
- ID del pedido (formato: FL-YYYY-MMDD-XXX)
- Fecha del pedido
- Estado actual (badge de color)
- Lista de productos (primeros 2 + contador)
- Total y ahorro (si es mayorista)
- Botones de acción según estado

**Filtros disponibles:**
- Todos
- Pendiente
- Confirmado
- Preparando
- Enviado
- Entregado
- Cancelado

#### 2. **Crear Nuevo Pedido**
**Ubicación:** `app/payments/index.tsx` → `processPayment()`
**Contexto:** `contexts/OrdersContext.tsx` → `addOrder()`

**Cómo funciona:**
1. Usuario completa el pago
2. Se crea el pedido con:
   - ID generado automáticamente
   - Fecha actual
   - Estado: "pending"
   - Items del carrito
   - Total y ahorro
   - Método de pago
   - Información de entrega
3. Se guarda en `AsyncStorage`
4. Se envía notificación: "✅ Compra Realizada Exitosamente"
5. Se actualizan métricas del usuario
6. Se limpia el carrito

**Generación de ID:**
```typescript
// Formato: FL-2024-0115-001
const year = new Date().getFullYear();
const month = String(new Date().getMonth() + 1).padStart(2, '0');
const day = String(new Date().getDate()).padStart(2, '0');
const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
return `FL-${year}-${month}${day}-${random}`;
```

#### 3. **Cambiar Estado de Pedido**
**Ubicación:** `contexts/OrdersContext.tsx` → `updateOrderStatus()`

**Estados disponibles:**
- `pending` - Pendiente de confirmación
- `confirmed` - Confirmado
- `preparing` - En preparación
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

**Cómo funciona:**
1. Se actualiza el estado del pedido
2. Se guarda en `AsyncStorage`
3. **Se envía notificación automática** según el nuevo estado:
   - Pendiente: "⏳ Pedido Pendiente"
   - Confirmado: "✅ Pedido Confirmado"
   - Preparando: "👨‍🍳 Pedido en Preparación"
   - Enviado: "🚚 Pedido Enviado"
   - Entregado: "🎉 Pedido Entregado"

**Notificaciones:** Implementadas en `contexts/OrdersContext.tsx` líneas 114-145

#### 4. **Cancelar Pedido**
**Ubicación:** `app/(tabs)/orders.tsx` → `handleCancelOrder()`
**Contexto:** `contexts/OrdersContext.tsx` → `updateOrderStatus(orderId, 'cancelled')`

**Cómo funciona:**
1. Usuario presiona "Cancelar" en un pedido pendiente
2. Se muestra confirmación
3. Se cambia el estado a "cancelled"
4. **Se envía notificación:** "❌ Pedido Cancelado"
5. Se muestra el total reembolsado

**Restricción:** Solo pedidos con estado "pending" pueden cancelarse

#### 5. **Ver Detalles del Pedido**
**Ubicación:** `app/(tabs)/orders.tsx` → Modal de detalles

**Muestra:**
- Información completa del pedido
- Lista completa de productos
- Resumen financiero
- Información de entrega
- Número de seguimiento (si está enviado)

---

## 💳 Módulo de Pagos

### Archivos Principales:
- **Pantalla:** `app/payments/index.tsx`
- **Contextos:** `CartContext`, `OrdersContext`, `StockContext`, `MetricsContext`
- **Constantes:** `constants/payments.ts`

### Funcionalidades Implementadas:

#### 1. **Visualización del Resumen**
**Ubicación:** `app/payments/index.tsx` → Sección "Resumen del Pedido"

**Muestra:**
- Lista de productos con cantidades
- Subtotal
- Ahorro mayorista (si aplica)
- Costo de envío
- Comisión de procesamiento (si aplica)
- **Total final**

#### 2. **Selección de Método de Pago**
**Ubicación:** `app/payments/index.tsx` → `renderPaymentMethod()`

**Métodos disponibles:**
1. **Tarjeta de Crédito/Débito**
   - Campos: número, vencimiento, CVV, nombre
   - Comisión: 3.5%
   
2. **Transferencia Bancaria**
   - Muestra datos de cuenta Frito-Lay
   - Campos: banco origen, cuenta, número de operación
   - Sin comisión

3. **Crédito Comercial**
   - Pago a 30 días
   - Solo para comerciantes registrados
   - Sin comisión

4. **Efectivo contra Entrega**
   - Pago al recibir
   - Sin comisión

**Configuración:** `constants/payments.ts`

#### 3. **Procesamiento del Pago**
**Ubicación:** `app/payments/index.tsx` → `processPayment()`

**Flujo completo:**
1. **Validación del pedido:**
   - Verifica que el carrito no esté vacío
   - Valida cantidades mínimas/máximas
   - Verifica disponibilidad de stock

2. **Verificación de stock:**
   - Para cada item, verifica stock disponible
   - Si no hay stock, muestra error y cancela

3. **Creación del pedido:**
   - Genera ID único
   - Crea objeto Order con todos los datos
   - Guarda en `OrdersContext`

4. **Actualización de métricas:**
   - Actualiza total de pedidos
   - Actualiza total gastado
   - Calcula ahorro acumulado
   - Actualiza productos top
   - Agrega actividad reciente

5. **Limpieza del carrito:**
   - Limpia todos los items
   - Resetea programación de entrega

6. **Notificación:**
   - **Se envía notificación:** "✅ Compra Realizada Exitosamente"
   - Muestra ID de pedido y total

7. **Navegación:**
   - Opción para ver pedidos
   - Opción para continuar comprando

**Código clave:** `app/payments/index.tsx` líneas 118-192

#### 4. **Validación de Datos de Pago**
**Ubicación:** `app/payments/index.tsx` → `handlePayment()`

**Validaciones:**
- Método de pago seleccionado
- Si es tarjeta: todos los campos completos
- Si es transferencia: todos los campos completos
- Pedido válido (no vacío, stock disponible)

---

## 🔔 Sistema de Notificaciones

### Archivos Principales:
- **Utilidades:** `utils/native-notifications.ts`
- **Hook:** `hooks/use-native-notifications.ts`
- **Inicialización:** `app/_layout.tsx`

### Funcionalidades Implementadas:

#### 1. **Notificación al Completar Compra**
**Ubicación:** `app/payments/index.tsx` → `processPayment()` línea 175

**Cuándo se dispara:**
- Después de procesar el pago exitosamente
- Después de crear el pedido
- Antes de limpiar el carrito

**Mensaje:**
```
✅ Compra Realizada Exitosamente
Tu pedido [ID] ha sido procesado. Total: S/ [total]. 
Te notificaremos cuando esté en camino.
```

#### 2. **Notificación al Cancelar Pedido**
**Ubicación:** `app/(tabs)/orders.tsx` → `handleCancelOrder()` línea 160

**Cuándo se dispara:**
- Cuando el usuario confirma la cancelación de un pedido
- Después de cambiar el estado a "cancelled"

**Mensaje:**
```
❌ Pedido Cancelado
Tu pedido [ID] ha sido cancelado exitosamente. 
Total reembolsado: S/ [total]
```

#### 3. **Notificaciones de Cambio de Estado**
**Ubicación:** `contexts/OrdersContext.tsx` → `updateOrderStatus()` líneas 114-145

**Cuándo se dispara:**
- Cada vez que cambia el estado de un pedido
- Automáticamente cuando se actualiza el estado

**Mensajes según estado:**
- **Pendiente:** "⏳ Pedido Pendiente - Tu pedido está pendiente de confirmación"
- **Confirmado:** "✅ Pedido Confirmado - Estamos preparándolo para ti"
- **Preparando:** "👨‍🍳 Pedido en Preparación - Pronto estará listo para enviar"
- **Enviado:** "🚚 Pedido Enviado - ¡Está en camino! [Número de seguimiento]"
- **Entregado:** "🎉 Pedido Entregado - ¡Entregado exitosamente!"

#### 4. **Inicialización del Sistema**
**Ubicación:** `app/_layout.tsx` → `useEffect()` línea 23
**Función:** `utils/native-notifications.ts` → `initializeNotifications()`

**Cómo funciona:**
1. Al iniciar la app, se inicializa el sistema de notificaciones
2. Se crea canal de notificaciones para Android
3. Se solicitan permisos
4. En Expo Go Android, usa Alert como fallback

**Comportamiento:**
- **Expo Go Android:** Notificaciones como Alert (alertas modales)
- **iOS/Development Build:** Notificaciones nativas del sistema

---

## 📷 Sistema de Cámara

### Archivos Principales:
- **Componente Modal:** `components/CameraView.tsx`
- **Pantalla Dedicada:** `app/camera/index.tsx`
- **Integración:** `app/(tabs)/profile.tsx`, `app/profile/index.tsx`

### Funcionalidades Implementadas:

#### 1. **Tomar Foto desde Perfil**
**Ubicación:** `app/(tabs)/profile.tsx` → `handleImagePicker()`

**Cómo funciona:**
1. Usuario toca ícono de cámara en foto de perfil
2. Aparece menú con opciones:
   - "Tomar Foto" → Abre `CameraView` modal
   - "Elegir de Galería" → Abre selector de imágenes
3. Si toma foto:
   - Se abre modal de cámara
   - Usuario puede cambiar cámara (frontal/trasera)
   - Presiona botón de captura
   - Se guarda la foto
4. Se actualiza `user.profileImage` con el URI
5. Se guarda en el perfil

**Componente:** `components/CameraView.tsx`

#### 2. **Componente de Cámara Reutilizable**
**Ubicación:** `components/CameraView.tsx`

**Características:**
- Modal que se puede usar en cualquier parte
- Manejo automático de permisos
- Cambio entre cámara frontal/trasera
- Interfaz moderna con controles intuitivos
- Callback `onCapture(uri)` cuando se toma la foto

**Uso:**
```tsx
<CameraView
  visible={showCamera}
  onClose={() => setShowCamera(false)}
  onCapture={(uri) => updateProfile({ profileImage: uri })}
  type="profile"
/>
```

#### 3. **Pantalla Dedicada de Cámara**
**Ubicación:** `app/camera/index.tsx`

**Acceso:** `router.push('/camera')`

**Características:**
- Pantalla completa para tomar fotos
- Mismos controles que el modal
- Útil para tomar fotos de productos u otros usos

---

## 📊 Gestión de Stock

### Archivos Principales:
- **Contexto:** `contexts/StockContext.tsx`
- **Datos:** `data/products.ts`

### Funcionalidades Implementadas:

#### 1. **Inicialización de Stock**
**Ubicación:** `contexts/StockContext.tsx` → `initializeStock()`

**Cómo funciona:**
1. Al iniciar la app, se carga el stock desde `AsyncStorage`
2. Si no existe, se inicializa con los valores de `data/products.ts`
3. Se sincroniza con la lista actual de productos
4. Se guarda automáticamente cuando cambia

#### 2. **Reducir Stock (Al Agregar al Carrito)**
**Ubicación:** `contexts/StockContext.tsx` → `reduceStock()`
**Uso:** `app/(tabs)/catalog.tsx` → `handleAddToCart()`

**Cómo funciona:**
1. Se verifica stock disponible
2. Si hay suficiente, se reduce la cantidad
3. Se guarda en `AsyncStorage`
4. Retorna `true` si fue exitoso, `false` si no hay stock

**Validación:** No permite reducir si no hay stock suficiente

#### 3. **Aumentar Stock (Al Eliminar del Carrito)**
**Ubicación:** `contexts/StockContext.tsx` → `increaseStock()`
**Uso:** `contexts/CartContext.tsx` → `removeFromCart()`

**Cómo funciona:**
1. Cuando se elimina un producto del carrito
2. Se devuelve la cantidad al inventario
3. Se actualiza el stock
4. Se guarda automáticamente

#### 4. **Verificar Disponibilidad**
**Ubicación:** `contexts/StockContext.tsx` → `isProductAvailable()`

**Uso:**
- Antes de agregar al carrito
- Al modificar cantidades
- Al procesar el pago

**Retorna:** `true` si hay stock suficiente, `false` si no

---

## 📈 Métricas y Estadísticas

### Archivos Principales:
- **Contexto:** `contexts/MetricsContext.tsx`
- **Visualización:** `app/(tabs)/profile.tsx`

### Funcionalidades Implementadas:

#### 1. **Actualización de Métricas**
**Ubicación:** `contexts/MetricsContext.tsx` → `updateMetrics()`
**Disparador:** `app/payments/index.tsx` → `processPayment()` línea 163

**Qué se actualiza:**
- Total de pedidos (+1)
- Total gastado (suma del nuevo pedido)
- Total ahorrado (suma de ahorros mayoristas)
- Valor promedio por pedido
- Productos más comprados (top 3)
- Marca favorita
- Progreso mensual
- Actividad reciente

**Cuándo se actualiza:**
- Cada vez que se completa un pago exitosamente

#### 2. **Visualización de Métricas**
**Ubicación:** `app/(tabs)/profile.tsx` → Sección "Dashboard del Comerciante"

**Muestra:**
- Total de pedidos realizados
- Total gastado
- Total ahorrado (modo mayorista)
- Progreso mensual (barra de progreso)
- Productos más comprados
- Actividad reciente

**Datos:** Vienen de `MetricsContext.getUserMetrics(userId)`

---

## 🎨 Sistema de Tema y Estilos

### Archivos Principales:
- **Constantes:** `constants/theme.ts`
- **Componentes:** `components/themed-view.tsx`, `components/themed-text.tsx`
- **Layout Responsive:** `components/ResponsiveLayout.tsx`

### Funcionalidades:

#### 1. **Colores Corporativos**
**Ubicación:** `constants/theme.ts` → `Colors`

**Colores Frito-Lay:**
- **Primario (Rojo):** `#E31E24`
- **Secundario (Azul):** `#004B87`
- **Acento (Amarillo):** `#FFD700`
- **Advertencia (Naranja):** `#FF8C00`
- **Éxito (Verde):** `#228B22`

#### 2. **Diseño Responsive**
**Ubicación:** `constants/theme.ts` → `Breakpoints`, `Dimensions`, `responsive()`

**Breakpoints:**
- xs: 320px (móviles pequeños)
- sm: 375px (móviles medianos)
- md: 414px (móviles grandes)
- lg: 768px (tablets)
- xl: 1024px (tablets grandes)

**Componentes Responsive:**
- `ResponsiveLayout` - Layout flexible
- `ResponsiveCard` - Tarjetas adaptables
- `ResponsiveButton` - Botones con tamaños adaptativos

---

## 🔄 Flujos Principales de la Aplicación

### Flujo 1: Compra Completa
1. **Login** → `app/auth/login.tsx`
2. **Explorar Catálogo** → `app/(tabs)/catalog.tsx`
3. **Agregar al Carrito** → `CartContext.addToCart()`
4. **Ver Carrito** → `app/(tabs)/cart.tsx`
5. **Programar Entrega** (si es mayorista) → `DeliveryScheduler`
6. **Ir a Pagos** → `app/payments/index.tsx`
7. **Seleccionar Método** → `handlePayment()`
8. **Procesar Pago** → `processPayment()`
9. **Crear Pedido** → `OrdersContext.addOrder()`
10. **Notificación** → "✅ Compra Realizada"
11. **Actualizar Métricas** → `MetricsContext.updateMetrics()`
12. **Limpiar Carrito** → `CartContext.clearCart()`

### Flujo 2: Cambio de Estado de Pedido
1. **Ver Pedidos** → `app/(tabs)/orders.tsx`
2. **Seleccionar Pedido** → Ver detalles
3. **Cambiar Estado** → `OrdersContext.updateOrderStatus()`
4. **Notificación Automática** → Según nuevo estado
5. **Actualizar UI** → Lista de pedidos

### Flujo 3: Actualizar Perfil
1. **Ir a Perfil** → `app/(tabs)/profile.tsx`
2. **Tocar Foto** → `handleImagePicker()`
3. **Elegir Opción** → Cámara o Galería
4. **Tomar/Seleccionar Foto** → `CameraView` o `ImagePicker`
5. **Actualizar Perfil** → `AuthContext.updateProfile()`
6. **Guardar** → `AsyncStorage` + `userStorage.ts`

---

## 📁 Estructura de Archivos por Funcionalidad

### Autenticación
```
contexts/AuthContext.tsx          → Lógica de autenticación
app/auth/login.tsx                 → Pantalla de login
app/auth/register.tsx              → Pantalla de registro
app/auth/forgot-password.tsx       → Recuperación de contraseña
components/AuthGuard.tsx           → Protección de rutas
data/userStorage.ts                → Almacenamiento de usuarios
data/seedUsers.ts                  → Usuarios de prueba
```

### Carrito y Compras
```
contexts/CartContext.tsx           → Estado del carrito
app/(tabs)/cart.tsx                → Pantalla del carrito
app/(tabs)/catalog.tsx             → Catálogo y agregar productos
components/DeliveryScheduler.tsx   → Programación de entregas
```

### Pedidos
```
contexts/OrdersContext.tsx          → Gestión de pedidos
app/(tabs)/orders.tsx              → Lista y detalles de pedidos
```

### Pagos
```
app/payments/index.tsx             → Procesamiento de pagos
constants/payments.ts              → Configuración de métodos
```

### Perfil
```
app/(tabs)/profile.tsx             → Perfil principal
app/profile/edit.tsx               → Editar perfil
app/profile/change-password.tsx    → Cambiar contraseña
```

### Notificaciones
```
utils/native-notifications.ts      → Funciones de notificaciones
hooks/use-native-notifications.ts  → Hook para usar notificaciones
```

### Cámara
```
components/CameraView.tsx          → Componente modal de cámara
app/camera/index.tsx               → Pantalla dedicada de cámara
```

### Stock
```
contexts/StockContext.tsx          → Gestión de inventario
data/products.ts                   → Datos de productos
```

### Métricas
```
contexts/MetricsContext.tsx        → Estadísticas y métricas
```

---

## 🔑 Puntos Clave para la Presentación

### 1. **Autenticación Segura**
- ✅ Login con validación
- ✅ Autenticación biométrica
- ✅ Registro completo
- ✅ Recuperación de contraseña
- ✅ Almacenamiento seguro (SecureStore)

### 2. **Gestión de Productos**
- ✅ Catálogo con búsqueda y filtros
- ✅ Gestión de stock en tiempo real
- ✅ Precios mayoristas y minoristas
- ✅ Validación de disponibilidad

### 3. **Carrito Inteligente**
- ✅ Modo mayorista/minorista
- ✅ Cálculo automático de ahorros
- ✅ Programación de entregas
- ✅ Persistencia local

### 4. **Sistema de Pedidos**
- ✅ Creación automática al pagar
- ✅ Seguimiento de estados
- ✅ Cancelación de pedidos
- ✅ Historial completo

### 5. **Pagos Múltiples**
- ✅ 4 métodos de pago
- ✅ Validación completa
- ✅ Integración con pedidos
- ✅ Actualización de métricas

### 6. **Notificaciones Automáticas**
- ✅ Al completar compra
- ✅ Al cancelar pedido
- ✅ Al cambiar estado de pedido
- ✅ Mensajes personalizados

### 7. **Perfil Completo**
- ✅ Edición de datos
- ✅ Foto de perfil (cámara/galería)
- ✅ Preferencias
- ✅ Estadísticas del comerciante

---

## 📝 Notas para la Demostración

### Flujo Recomendado para Mostrar:

1. **Login** → Mostrar autenticación biométrica
2. **Catálogo** → Buscar producto, agregar al carrito
3. **Carrito** → Modificar cantidades, ver totales
4. **Pago** → Seleccionar método, procesar
5. **Notificación** → Ver notificación de compra exitosa
6. **Pedidos** → Ver pedido creado, cambiar estado
7. **Notificaciones** → Ver notificaciones de cambio de estado
8. **Perfil** → Tomar foto, ver estadísticas

### Funciones Destacadas:

- ✅ **Notificaciones automáticas** en cada acción importante
- ✅ **Modo mayorista** con precios especiales
- ✅ **Gestión de stock** en tiempo real
- ✅ **Cámara integrada** para foto de perfil
- ✅ **Métricas** del comerciante
- ✅ **Diseño responsive** adaptado a diferentes pantallas

---

**Última actualización:** Diciembre 2024
**Versión de la App:** 1.0.0
**Expo SDK:** 54.0.25

