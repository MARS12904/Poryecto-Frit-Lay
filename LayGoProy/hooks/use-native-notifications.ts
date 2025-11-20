import { useCallback, useEffect } from 'react';
import {
  showNativeNotification,
  scheduleNativeNotification,
  requestPermissions,
  initializeNotifications,
  cancelNotification,
  cancelAllNotifications,
  NotificationData,
} from '../utils/native-notifications';

/**
 * Hook para notificaciones nativas del sistema usando expo-notifications
 * Funciona como WhatsApp, YouTube, etc. - notificaciones reales del sistema
 * 
 * Documentación: https://docs.expo.dev/versions/latest/sdk/notifications
 * 
 * Ejemplo de uso:
 * ```tsx
 * const { sendNotification, scheduleNotification } = useNativeNotifications();
 * 
 * // Enviar notificación inmediata
 * sendNotification({
 *   title: 'Pedido Confirmado',
 *   body: 'Tu pedido ha sido procesado correctamente'
 * });
 * 
 * // Programar notificación para 10 segundos
 * scheduleNotification({
 *   title: 'Recordatorio',
 *   body: 'Tu pedido llegará pronto'
 * }, 10);
 * ```
 */
export const useNativeNotifications = () => {
  // Inicializar notificaciones al montar el componente
  useEffect(() => {
    const init = async () => {
      await initializeNotifications();
    };
    init();
  }, []);

  const sendNotification = useCallback(
    async (notification: NotificationData): Promise<string> => {
      return await showNativeNotification(notification);
    },
    []
  );

  const scheduleNotification = useCallback(
    async (
      notification: NotificationData,
      seconds: number
    ): Promise<string> => {
      return await scheduleNativeNotification(notification, seconds);
    },
    []
  );

  const cancel = useCallback(async (notificationId: string): Promise<void> => {
    await cancelNotification(notificationId);
  }, []);

  const cancelAll = useCallback(async (): Promise<void> => {
    await cancelAllNotifications();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    return await requestPermissions();
  }, []);

  return {
    sendNotification,
    scheduleNotification,
    cancelNotification: cancel,
    cancelAllNotifications: cancelAll,
    requestPermission,
  };
};
