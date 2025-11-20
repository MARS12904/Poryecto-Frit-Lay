# 📱 Guía de Notificaciones - Frito-Lay App

## 🔍 Cómo están implementadas

Las notificaciones están implementadas de forma **simple** usando:
- ✅ `Alert` de React Native (no Expo Notifications)
- ✅ `expo-haptics` para vibración
- ✅ `AsyncStorage` para guardar notificaciones pendientes

**Limitación importante:** Solo funcionan cuando la app está **abierta o en segundo plano**. NO funcionan cuando la app está completamente cerrada.

---

## 🚀 Cómo ejecutar/probar notificaciones

### Opción 1: Usando el Hook `useSimpleNotifications`

```tsx
import { useSimpleNotifications } from '../hooks/use-simple-notifications';
r
function MiComponente() {
  const { sendNotification, scheduleNotification } = useSimpleNotifications();

  // Notificación inmediata
  const handleNotificacionInmediata = () => {
    sendNotification({
      title: 'Pedido Confirmado',
      body: 'Tu pedido ha sido procesado correctamente'
    });
  };

  // Notificación programada (en 5 segundos)
  const handleNotificacionProgramada = () => {
    scheduleNotification({
      title: 'Recordatorio',
      body: 'Tu pedido llegará en 30 minutos'
    }, 5); // 5 segundos
  };

  return (
    <View>
      <Button title="Notificación Inmediata" onPress={handleNotificacionInmediata} />
      <Button title="Notificación en 5 seg" onPress={handleNotificacionProgramada} />
    </View>
  );
}
```

### Opción 2: Usando las funciones directamente

```tsx
import { showLocalNotification, scheduleLocalNotification } from '../utils/simple-notifications';

// Notificación inmediata
showLocalNotification({
  title: '¡Bienvenido!',
  body: 'Gracias por usar Frito-Lay Comerciantes'
});

// Notificación programada (en 10 segundos)
const timeoutId = scheduleLocalNotification({
  title: 'Recordatorio',
  body: 'No olvides revisar tu pedido'
}, 10);
```

### Opción 3: Guardar notificaciones pendientes (persistencia)

```tsx
import { savePendingNotification } from '../utils/simple-notifications';

// Guarda una notificación que se mostrará incluso si la app se reinicia
const notificationId = await savePendingNotification({
  title: 'Pedido en camino',
  body: 'Tu pedido está siendo entregado'
}, 60); // Se mostrará en 60 segundos
```

---

## 📝 Ejemplo completo: Agregar botón de prueba en Home

Puedes agregar esto en `app/(tabs)/index.tsx`:

```tsx
import { useSimpleNotifications } from '../../hooks/use-simple-notifications';

function HomeContent() {
  const { sendNotification, scheduleNotification } = useSimpleNotifications();
  
  const testNotification = () => {
    sendNotification({
      title: 'Test de Notificación',
      body: 'Las notificaciones están funcionando correctamente ✅'
    });
  };

  const testScheduledNotification = () => {
    scheduleNotification({
      title: 'Notificación Programada',
      body: 'Esta notificación se programó para 3 segundos'
    }, 3);
  };

  // ... resto del código ...
  
  // Agregar botones de prueba en el JSX
  <TouchableOpacity onPress={testNotification} style={styles.testButton}>
    <Text>Probar Notificación Inmediata</Text>
  </TouchableOpacity>
  
  <TouchableOpacity onPress={testScheduledNotification} style={styles.testButton}>
    <Text>Probar Notificación Programada (3 seg)</Text>
  </TouchableOpacity>
}
```

---

## ⚠️ Limitaciones actuales

1. **No funcionan con app cerrada**: Solo funcionan cuando la app está abierta o en segundo plano
2. **Usan Alert nativo**: Se muestran como alertas modales, no como notificaciones del sistema
3. **No hay push notifications**: No pueden recibir notificaciones desde un servidor

---

## 🔄 Para mejorar a notificaciones nativas

Si necesitas notificaciones que funcionen con la app cerrada, necesitarías:

1. **Instalar Expo Notifications:**
```bash
npx expo install expo-notifications
```

2. **Configurar permisos** en `app.json`

3. **Reemplazar** el sistema actual con `expo-notifications`

¿Quieres que te ayude a migrar a Expo Notifications para tener notificaciones nativas?

