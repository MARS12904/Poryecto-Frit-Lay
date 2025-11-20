import { Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  priority?: 'high' | 'default' | 'low';
}

/**
 * Sistema de notificaciones nativas usando expo-notifications
 * Funciona en iOS y Android con notificaciones del sistema reales
 * Compatible con Expo SDK 54
 * 
 * IMPORTANTE: En Expo Go Android, las notificaciones push no están disponibles desde SDK 53.
 * Este código usa Alert como fallback en Expo Go Android.
 * Para notificaciones nativas completas, usa un Development Build.
 * 
 * Documentación: https://docs.expo.dev/versions/latest/sdk/notifications
 */

// Verificar si estamos en Expo Go
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Importación condicional de expo-notifications para evitar errores en Expo Go
let Notifications: any = null;
let notificationsAvailable = false;

try {
  // Intentar importar expo-notifications
  Notifications = require('expo-notifications');
  
  // Verificar si estamos en Expo Go Android (donde push notifications no funcionan)
  if (isExpoGo && Platform.OS === 'android') {
    // En Expo Go Android, no usamos expo-notifications para evitar errores
    notificationsAvailable = false;
    console.log('Expo Go Android detectado - usando Alert como fallback para notificaciones');
  } else {
    // En iOS o Development Build, las notificaciones funcionan
    notificationsAvailable = true;
    
    // Configurar handler solo si las notificaciones están disponibles
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } catch (error) {
      console.warn('No se pudo configurar el handler de notificaciones:', error);
      notificationsAvailable = false;
    }
  }
} catch (error) {
  console.warn('expo-notifications no disponible, usando Alert como fallback:', error);
  notificationsAvailable = false;
}

/**
 * Inicializa el sistema de notificaciones
 */
export const initializeNotifications = async (): Promise<void> => {
  try {
    // Si no hay notificaciones disponibles, no hacer nada
    if (!notificationsAvailable || !Notifications) {
      return;
    }

    // Crear canal de notificaciones para Android
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('fritolay-default', {
          name: 'Frito-Lay Notificaciones',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#E31E24', // Color rojo de Frito-Lay
          sound: 'default',
        });
      } catch (error) {
        console.warn('Error creando canal de notificaciones:', error);
      }
    }

    // Solicitar permisos (solo si las notificaciones están disponibles)
    await requestPermissions();
  } catch (error) {
    console.warn('Error inicializando notificaciones (continuando sin notificaciones):', error);
  }
};

/**
 * Solicita permisos para notificaciones
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    // Si no hay notificaciones disponibles, retornar false
    if (!notificationsAvailable || !Notifications) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permisos de notificaciones no otorgados');
      return false;
    }

    return true;
  } catch (error) {
    // No es crítico si falla, solo mostramos un warning
    console.warn('Error solicitando permisos (continuando sin notificaciones):', error);
    return false;
  }
};

/**
 * Muestra una notificación nativa del sistema
 * En Expo Go Android, usa Alert como fallback
 */
export const showNativeNotification = async (
  notification: NotificationData
): Promise<string> => {
  try {
    // Vibrar si está disponible
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
        // Ignorar errores de haptics
      });
    }

    // Si no hay notificaciones disponibles (Expo Go Android), usar Alert
    if (!notificationsAvailable || !Notifications) {
      Alert.alert(notification.title, notification.body);
      return `alert_${Date.now()}`;
    }

    // Mostrar notificación inmediata usando expo-notifications
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
        },
        trigger: null, // null = mostrar inmediatamente
      });

      return notificationId;
    } catch (error) {
      // Si falla, usar Alert como fallback
      console.warn('Error mostrando notificación nativa, usando Alert:', error);
      Alert.alert(notification.title, notification.body);
      return `alert_${Date.now()}`;
    }
  } catch (error) {
    // Fallback a Alert si todo falla
    console.warn('Error en showNativeNotification, usando Alert como fallback:', error);
    Alert.alert(notification.title, notification.body);
    return `alert_${Date.now()}`;
  }
};

/**
 * Programa una notificación nativa
 */
export const scheduleNativeNotification = async (
  notification: NotificationData,
  seconds: number
): Promise<string> => {
  try {
    // Si no hay notificaciones disponibles, usar setTimeout
    if (!notificationsAvailable || !Notifications) {
      const notificationId = `scheduled_${Date.now()}`;
      setTimeout(async () => {
        await showNativeNotification(notification);
      }, seconds * 1000);
      return notificationId;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: seconds,
        },
      });

      return notificationId;
    } catch (error) {
      // Fallback a setTimeout si falla
      console.warn('Error programando notificación, usando setTimeout:', error);
      const notificationId = `scheduled_${Date.now()}`;
      setTimeout(async () => {
        await showNativeNotification(notification);
      }, seconds * 1000);
      return notificationId;
    }
  } catch (error) {
    // Fallback a setTimeout si todo falla
    console.warn('Error en scheduleNativeNotification, usando setTimeout:', error);
    const notificationId = `scheduled_${Date.now()}`;
    setTimeout(async () => {
      await showNativeNotification(notification);
    }, seconds * 1000);
    return notificationId;
  }
};

/**
 * Cancela una notificación programada
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    if (!notificationsAvailable || !Notifications) {
      return; // No hay nada que cancelar si usamos Alert
    }
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Error cancelando notificación:', error);
  }
};

/**
 * Cancela todas las notificaciones programadas
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    if (!notificationsAvailable || !Notifications) {
      return; // No hay nada que cancelar si usamos Alert
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Error cancelando todas las notificaciones:', error);
  }
};
