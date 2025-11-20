# 📱 Instrucciones para Notificaciones Nativas del Sistema

## 🎯 Objetivo
Implementar notificaciones nativas del sistema (como WhatsApp, YouTube) usando `expo-notifications` según la documentación oficial de Expo.

## 📦 Paso 1: Instalar expo-notifications

Ejecuta este comando en la terminal desde la carpeta `LayGoProy`:

```bash
npx expo install expo-notifications
```

## ⚠️ Importante: Development Build requerido

Según la [documentación oficial de Expo](https://docs.expo.dev/versions/latest/sdk/notifications):

> **Push notifications (remote notifications) functionality provided by `expo-notifications` is unavailable in Expo Go on Android from SDK 53. A development build is required to use push notifications. Local notifications (in-app notifications) remain available in Expo Go.**

**Las notificaciones locales (local notifications) SÍ funcionan en Expo Go**, pero para una mejor experiencia y para que funcionen cuando la app está cerrada, se recomienda un Development Build.

## 🔧 Paso 2: Crear Development Build (Opcional pero Recomendado)

### Opción A: Development Build con EAS (Recomendado)

1. Instala EAS CLI si no lo tienes:
```bash
npm install -g eas-cli
```

2. Inicia sesión en Expo:
```bash
eas login
```

3. Configura el proyecto:
```bash
eas build:configure
```

4. Crea un build de desarrollo:
```bash
eas build --profile development --platform android
# o para iOS:
eas build --profile development --platform ios
```

### Opción B: Build local con Expo

```bash
npx expo prebuild
npx expo run:android
# o para iOS:
npx expo run:ios
```

## ✅ Paso 3: Verificar la configuración

Ya está todo configurado en el código:
- ✅ `app.json` tiene el plugin de expo-notifications configurado
- ✅ `utils/native-notifications.ts` usa expo-notifications según la documentación oficial
- ✅ `hooks/use-native-notifications.ts` tiene el hook listo
- ✅ Todos los lugares donde se usan notificaciones están actualizados

## 🧪 Paso 4: Probar las notificaciones

### Notificaciones Locales (funcionan en Expo Go)

1. **Realizar una compra:**
   - Agregar productos al carrito
   - Completar el pago
   - Verás una notificación nativa: "✅ Compra Realizada Exitosamente"

2. **Cambiar estado de pedido:**
   - Las notificaciones aparecerán automáticamente cuando cambie el estado

3. **Cancelar pedido:**
   - Al cancelar un pedido, verás: "❌ Pedido Cancelado"

4. **Botones de prueba en Home:**
   - En la pantalla de inicio hay botones para probar notificaciones inmediatas y programadas

## 🔍 Características de las notificaciones nativas

- ✅ Aparecen en la barra de notificaciones del sistema
- ✅ Funcionan cuando la app está en segundo plano
- ✅ Tienen sonido y vibración
- ✅ Se pueden tocar para abrir la app
- ✅ Se muestran en el centro de notificaciones del celular
- ✅ Compatible con Expo SDK 54

## 📚 Documentación oficial

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications)
- [Expo Development Builds](https://docs.expo.dev/development/introduction/)

## ⚠️ Notas importantes

1. **Notificaciones locales funcionan en Expo Go:** Las notificaciones locales (las que usamos) funcionan en Expo Go
2. **Push notifications requieren Development Build:** Solo las notificaciones push remotas requieren un build
3. **Permisos:** La primera vez que uses la app, pedirá permisos de notificaciones
4. **Android:** Requiere Android 5.0+ (API 21+)
5. **iOS:** Requiere iOS 10.0+
6. **Dispositivos físicos:** Las notificaciones no funcionan en emuladores/simuladores

## 🐛 Solución de problemas

### Si las notificaciones no aparecen:

1. Verifica que instalaste `expo-notifications`
2. Asegúrate de estar usando un dispositivo físico (no emulador)
3. Verifica que los permisos estén habilitados en la configuración del celular
4. Revisa la consola para ver si hay errores
5. Reinicia la app después de instalar expo-notifications

### Si ves errores de importación:

```bash
# Limpia el cache y reinstala
npm start -- --clear
# o
npx expo start --clear
```

### Si necesitas notificaciones cuando la app está cerrada:

Necesitas crear un Development Build. Las notificaciones locales funcionan cuando la app está en segundo plano, pero para que funcionen completamente cerradas, necesitas un build.

## 💡 Ejemplo de uso

```tsx
import { useNativeNotifications } from '../hooks/use-native-notifications';

function MiComponente() {
  const { sendNotification } = useNativeNotifications();

  const handleCompra = async () => {
    await sendNotification({
      title: '✅ Compra Realizada',
      body: 'Tu pedido ha sido procesado exitosamente'
    });
  };

  return <Button onPress={handleCompra} title="Comprar" />;
}
```
