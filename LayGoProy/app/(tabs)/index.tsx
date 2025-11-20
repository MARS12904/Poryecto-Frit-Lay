import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import DeliveryScheduler from '../../components/DeliveryScheduler';
import { ResponsiveCard, ResponsiveLayout } from '../../components/ResponsiveLayout';
import { BorderRadius, Colors, Dimensions, FontSizes, Shadows, Spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useMetrics } from '../../contexts/MetricsContext';
import { useNativeNotifications } from '../../hooks/use-native-notifications';

export default function HomeScreen() {
  return <HomeContent />;
}

function HomeContent() {
  const { user } = useAuth();
  const { 
    totalItems, 
    totalPrice, 
    wholesaleTotal, 
    regularTotal, 
    isWholesaleMode, 
    toggleWholesaleMode,
    getCartSummary,
    deliverySchedule,
    setDeliverySchedule
  } = useCart();
  const { getUserMetrics } = useMetrics();
  const { sendNotification, scheduleNotification } = useNativeNotifications();
  const [showDeliveryScheduler, setShowDeliveryScheduler] = useState(false);
  const cartSummary = getCartSummary();

  // Obtener métricas del usuario para el dashboard
  const userMetrics = user ? getUserMetrics(user.id) : {
    totalOrders: 0,
    totalSpent: 0,
    totalSavings: 0,
    averageOrderValue: 0,
    monthlyGoal: 5000,
    monthlyProgress: 0,
  };

  // Funciones de prueba de notificaciones
  const testImmediateNotification = () => {
    sendNotification({
      title: '✅ Notificación de Prueba',
      body: 'Las notificaciones están funcionando correctamente. Esta es una notificación inmediata.'
    });
  };

  const testScheduledNotification = () => {
    sendNotification({
      title: '⏰ Notificación Programada',
      body: 'Esta notificación se mostrará en 3 segundos...'
    });
    scheduleNotification({
      title: '✅ Notificación Programada',
      body: '¡Esta notificación se programó correctamente! Se mostró después de 3 segundos.'
    }, 3);
  };

  const handleWholesaleToggle = () => {
    Alert.alert(
      'Cambiar Modo de Compra',
      isWholesaleMode 
        ? '¿Cambiar a modo minorista? Perderás los precios mayoristas.'
        : '¿Cambiar a modo mayorista? Obtendrás precios especiales para comerciantes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: toggleWholesaleMode }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con branding Frito-Lay */}
      <ResponsiveCard style={styles.header} padding="lg">
        <ResponsiveLayout direction="row" justify="space-between" align="center">
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Frito-Lay</Text>
            <Text style={styles.brandSubtext}>Comerciantes</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>¡Hola, {user?.name}!</Text>
            <Text style={styles.subtitleText}>Tu plataforma de reabastecimiento</Text>
          </View>
        </ResponsiveLayout>
      </ResponsiveCard>

      {/* Modo de compra */}
      <ResponsiveCard style={styles.modeContainer}>
        <ResponsiveLayout direction="row" justify="space-between" align="center" gap="md">
          <Text style={styles.modeTitle}>Modo de Compra</Text>
          <Switch
            value={isWholesaleMode}
            onValueChange={handleWholesaleToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
            thumbColor={isWholesaleMode ? Colors.light.accent : Colors.light.textLight}
          />
        </ResponsiveLayout>
        <Text style={styles.modeDescription}>
          {isWholesaleMode 
            ? 'Precios mayoristas activos - Ideal para reabastecimiento de tienda'
            : 'Precios minoristas - Para compras personales'
          }
        </Text>
      </ResponsiveCard>

      {/* Dashboard del Comerciante */}
      <ResponsiveCard style={styles.dashboardContainer} padding="lg">
        <Text style={styles.dashboardTitle}>Dashboard del Comerciante</Text>
        <ResponsiveLayout direction="row" justify="space-around" align="center" gap="sm" style={styles.dashboardStats}>
          <View style={styles.dashboardStat}>
            <Ionicons name="receipt" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.primary} />
            <Text style={styles.dashboardStatNumber}>{userMetrics.totalOrders}</Text>
            <Text style={styles.dashboardStatLabel}>Pedidos</Text>
          </View>
          <View style={styles.dashboardStat}>
            <Ionicons name="cash" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.success} />
            <Text style={styles.dashboardStatNumber}>S/ {userMetrics.totalSpent.toFixed(2)}</Text>
            <Text style={styles.dashboardStatLabel}>Total Gastado</Text>
          </View>
          <View style={styles.dashboardStat}>
            <Ionicons name="trending-down" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.warning} />
            <Text style={styles.dashboardStatNumber}>S/ {userMetrics.totalSavings.toFixed(2)}</Text>
            <Text style={styles.dashboardStatLabel}>Ahorrado</Text>
          </View>
        </ResponsiveLayout>
        {userMetrics.monthlyGoal > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso Mensual</Text>
              <Text style={styles.progressText}>
                S/ {userMetrics.monthlyProgress.toFixed(2)} / S/ {userMetrics.monthlyGoal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((userMetrics.monthlyProgress / userMetrics.monthlyGoal) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </ResponsiveCard>

      {/* Estadísticas del carrito actual */}
      <ResponsiveLayout direction="row" justify="space-around" align="center" gap="sm" style={styles.cartStatsContainer}>
        <ResponsiveCard style={styles.statCard} padding="md">
          <Ionicons name="cart" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.primary} />
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>En Carrito</Text>
        </ResponsiveCard>
        <ResponsiveCard style={styles.statCard} padding="md">
          <Ionicons name="cash" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.success} />
          <Text style={styles.statNumber}>S/ {totalPrice.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Actual</Text>
        </ResponsiveCard>
        <ResponsiveCard style={styles.statCard} padding="md">
          <Ionicons name="trending-down" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.warning} />
          <Text style={styles.statNumber}>S/ {cartSummary.wholesaleSavings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Ahorro</Text>
        </ResponsiveCard>
      </ResponsiveLayout>

      {/* Programación de entrega */}
      {isWholesaleMode && (
        <View style={styles.deliveryContainer}>
          <View style={styles.deliveryHeader}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            <Text style={styles.deliveryTitle}>Entrega Programada</Text>
          </View>
          {deliverySchedule ? (
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryDate}>{deliverySchedule.date}</Text>
              <Text style={styles.deliveryTime}>{deliverySchedule.timeSlot}</Text>
              <Text style={styles.deliveryAddress}>{deliverySchedule.address}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.scheduleButton}
              onPress={() => setShowDeliveryScheduler(true)}
            >
              <Ionicons name="add-circle" size={20} color={Colors.light.primary} />
              <Text style={styles.scheduleButtonText}>Programar Entrega</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Acciones rápidas */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/catalog')}
        >
          <Ionicons name="grid" size={24} color={Colors.light.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Catálogo de Productos</Text>
            <Text style={styles.actionSubtext}>Ver todos los productos disponibles</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <Ionicons name="receipt" size={24} color={Colors.light.warning} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Mis Pedidos</Text>
            <Text style={styles.actionSubtext}>Historial y seguimiento</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="analytics" size={24} color={Colors.light.secondary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Dashboard de Ventas</Text>
            <Text style={styles.actionSubtext}>Métricas y reportes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={24} color={Colors.light.info} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Mi Perfil</Text>
            <Text style={styles.actionSubtext}>Configuración de cuenta</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      {/* Beneficios para comerciantes */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Beneficios Exclusivos</Text>
        
        <View style={styles.benefitItem}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.light.success} />
          <Text style={styles.benefitText}>Precios mayoristas preferenciales</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Ionicons name="flash" size={20} color={Colors.light.warning} />
          <Text style={styles.benefitText}>Entrega programada y confiable</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Ionicons name="refresh" size={20} color={Colors.light.primary} />
          <Text style={styles.benefitText}>Reabastecimiento automático</Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="headset" size={20} color={Colors.light.info} />
          <Text style={styles.benefitText}>Soporte especializado 24/7</Text>
        </View>
      </View>

      {/* Sección de prueba de notificaciones (solo para desarrollo) */}
      <View style={styles.testNotificationsContainer}>
        <Text style={styles.sectionTitle}>🔔 Prueba de Notificaciones</Text>
        <Text style={styles.testDescription}>
          Prueba el sistema de notificaciones de la app
        </Text>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={testImmediateNotification}
        >
          <Ionicons name="notifications" size={20} color={Colors.light.background} />
          <Text style={styles.testButtonText}>Notificación Inmediata</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, styles.testButtonSecondary]}
          onPress={testScheduledNotification}
        >
          <Ionicons name="time" size={20} color={Colors.light.primary} />
          <Text style={[styles.testButtonText, styles.testButtonTextSecondary]}>
            Notificación Programada (3 seg)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de programación de entrega */}
      <DeliveryScheduler
        visible={showDeliveryScheduler}
        onClose={() => setShowDeliveryScheduler(false)}
        onSchedule={setDeliverySchedule}
        existingSchedule={deliverySchedule}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.light.primary,
    marginBottom: Spacing.lg,
  },
  brandContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  brandText: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xxl : FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.light.background,
    letterSpacing: 1,
  },
  brandSubtext: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xs : FontSizes.sm,
    color: Colors.light.accent,
    fontWeight: '600',
    marginTop: -Spacing.xs,
  },
  userInfo: {
    alignItems: 'flex-end',
    flex: 1,
  },
  welcomeText: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.md : FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.light.background,
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xs : FontSizes.sm,
    color: Colors.light.accent,
    textAlign: 'right',
  },
  modeContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modeTitle: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.md : FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  modeDescription: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xs : FontSizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: Dimensions.isSmallScreen ? 16 : 20,
    marginTop: Spacing.sm,
  },
  dashboardContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  dashboardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  dashboardStats: {
    marginBottom: Spacing.md,
  },
  dashboardStat: {
    flex: 1,
    alignItems: 'center',
  },
  dashboardStatNumber: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.lg : FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginVertical: Spacing.xs,
  },
  dashboardStatLabel: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xs : FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.light.text,
  },
  progressText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
  },
  cartStatsContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: Dimensions.isSmallScreen ? 80 : 100,
  },
  statNumber: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.lg : FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Dimensions.isSmallScreen ? FontSizes.xs : FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  deliveryContainer: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  deliveryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: Spacing.sm,
  },
  deliveryInfo: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  deliveryDate: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  deliveryTime: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  deliveryAddress: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
  },
  scheduleButtonText: {
    fontSize: FontSizes.md,
    color: Colors.light.primary,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
  quickActions: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  actionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  actionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  benefitsContainer: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  benefitText: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    marginLeft: Spacing.md,
    flex: 1,
  },
  testNotificationsContainer: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  testDescription: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  testButtonSecondary: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  testButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.background,
    marginLeft: Spacing.sm,
  },
  testButtonTextSecondary: {
    color: Colors.light.primary,
  },
});