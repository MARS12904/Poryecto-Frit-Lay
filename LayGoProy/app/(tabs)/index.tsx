import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import DeliveryScheduler from '../../components/DeliveryScheduler';
import { ResponsiveCard, ResponsiveLayout } from '../../components/ResponsiveLayout';
import { BorderRadius, Colors, Dimensions, FontSizes, Shadows, Spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

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

  const [showDeliveryScheduler, setShowDeliveryScheduler] = useState(false);
  const cartSummary = getCartSummary();

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

      {/* Estadísticas del carrito */}
      <ResponsiveLayout direction="row" justify="space-around" align="center" gap="sm">
        <ResponsiveCard style={styles.statCard} padding="md">
          <Ionicons name="cart" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.primary} />
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </ResponsiveCard>
        <ResponsiveCard style={styles.statCard} padding="md">
          <Ionicons name="cash" size={Dimensions.isSmallScreen ? 20 : 24} color={Colors.light.success} />
          <Text style={styles.statNumber}>S/ {totalPrice.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total</Text>
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
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="grid" size={24} color={Colors.light.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Catálogo de Productos</Text>
            <Text style={styles.actionSubtext}>Ver todos los productos disponibles</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="receipt" size={24} color={Colors.light.warning} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Mis Pedidos</Text>
            <Text style={styles.actionSubtext}>Historial y seguimiento</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics" size={24} color={Colors.light.secondary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionText}>Dashboard de Ventas</Text>
            <Text style={styles.actionSubtext}>Métricas y reportes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
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
});