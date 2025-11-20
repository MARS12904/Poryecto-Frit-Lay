import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Solución simple de notificaciones locales
 * Funciona completamente local sin dependencias externas
 * 
 * Nota: Para notificaciones que aparezcan cuando la app está cerrada,
 * necesitarás usar una biblioteca nativa. Esta solución funciona cuando
 * la app está abierta o en segundo plano.
 */

/**
 * Muestra una notificación inmediata (cuando la app está abierta)
 * Usa Alert nativo de React Native
 */
export const showLocalNotification = (notification: NotificationData): void => {
  // Vibrar si está disponible
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      // Ignorar errores de haptics
    });
  }

  // Mostrar alerta
  Alert.alert(
    notification.title,
    notification.body,
    [
      {
        text: 'OK',
        style: 'default',
      },
    ],
    { cancelable: true }
  );
};

/**
 * Programa una notificación simple
 * @param notification - Datos de la notificación
 * @param seconds - Segundos de espera antes de mostrar
 */
export const scheduleLocalNotification = (
  notification: NotificationData,
  seconds: number
): NodeJS.Timeout => {
  return setTimeout(() => {
    showLocalNotification(notification);
  }, seconds * 1000);
};

/**
 * Cancela una notificación programada
 */
export const cancelScheduledNotification = (timeoutId: NodeJS.Timeout): void => {
  clearTimeout(timeoutId);
};

/**
 * Guarda notificaciones pendientes en AsyncStorage
 * Útil para mostrar notificaciones cuando la app se reinicia
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = '@app_pending_notifications';

interface PendingNotification {
  id: string;
  notification: NotificationData;
  scheduledTime: number;
}

/**
 * Guarda una notificación para mostrar más tarde
 */
export const savePendingNotification = async (
  notification: NotificationData,
  seconds: number
): Promise<string> => {
  try {
    const id = `notif_${Date.now()}`;
    const pending: PendingNotification = {
      id,
      notification,
      scheduledTime: Date.now() + seconds * 1000,
    };

    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications: PendingNotification[] = existing ? JSON.parse(existing) : [];
    notifications.push(pending);

    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    // Programar la notificación
    setTimeout(() => {
      showLocalNotification(notification);
      removePendingNotification(id);
    }, seconds * 1000);

    return id;
  } catch (error) {
    console.error('Error guardando notificación pendiente:', error);
    return '';
  }
};

/**
 * Remueve una notificación pendiente
 */
const removePendingNotification = async (id: string): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    if (!existing) return;

    const notifications: PendingNotification[] = JSON.parse(existing);
    const filtered = notifications.filter((n) => n.id !== id);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removiendo notificación pendiente:', error);
  }
};

/**
 * Verifica y muestra notificaciones pendientes
 * Útil para llamar cuando la app se abre
 */
export const checkPendingNotifications = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    if (!existing) return;

    const notifications: PendingNotification[] = JSON.parse(existing);
    const now = Date.now();

    // Filtrar notificaciones que ya pasaron su tiempo
    const valid = notifications.filter((n) => n.scheduledTime > now);
    const expired = notifications.filter((n) => n.scheduledTime <= now);

    // Mostrar notificaciones expiradas inmediatamente
    expired.forEach((n) => {
      showLocalNotification(n.notification);
    });

    // Guardar solo las válidas
    if (valid.length !== notifications.length) {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(valid));
    }
  } catch (error) {
    console.error('Error verificando notificaciones pendientes:', error);
  }
};

/**
 * Limpia todas las notificaciones pendientes
 */
export const clearAllPendingNotifications = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('Error limpiando notificaciones pendientes:', error);
  }
};

