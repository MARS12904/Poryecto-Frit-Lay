import { useCallback } from 'react';
import {
  showLocalNotification,
  scheduleLocalNotification,
  savePendingNotification,
  checkPendingNotifications,
  clearAllPendingNotifications,
  NotificationData,
} from '../utils/simple-notifications';

/**
 * Hook simple para notificaciones locales
 * 
 * Ejemplo de uso:
 * ```tsx
 * const { sendNotification, scheduleNotification } = useSimpleNotifications();
 * 
 * // Enviar notificación inmediata
 * sendNotification({
 *   title: 'Pedido confirmado',
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
export const useSimpleNotifications = () => {
  const sendNotification = useCallback((notification: NotificationData) => {
    showLocalNotification(notification);
  }, []);

  const scheduleNotification = useCallback(
    (notification: NotificationData, seconds: number): NodeJS.Timeout => {
      return scheduleLocalNotification(notification, seconds);
    },
    []
  );

  const saveNotification = useCallback(
    async (notification: NotificationData, seconds: number): Promise<string> => {
      return await savePendingNotification(notification, seconds);
    },
    []
  );

  const checkNotifications = useCallback(async () => {
    await checkPendingNotifications();
  }, []);

  const clearNotifications = useCallback(async () => {
    await clearAllPendingNotifications();
  }, []);

  return {
    sendNotification,
    scheduleNotification,
    saveNotification,
    checkNotifications,
    clearNotifications,
  };
};

