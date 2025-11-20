import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
  Alert, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useMetrics } from '../../contexts/MetricsContext';
import * as ImagePicker from 'expo-image-picker';
import CameraView from '../../components/CameraView';
import { 
  Colors, 
  Spacing, 
  FontSizes, 
  BorderRadius, 
  Shadows, 
  responsive 
} from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const { clearCart, isWholesaleMode } = useCart();
  const { getUserMetrics } = useMetrics();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notifications ?? true
  );
  const [showCamera, setShowCamera] = useState(false);

  /**
   * Obtiene las métricas del comerciante desde el contexto de métricas
   * Incluye: total de pedidos, gasto total, ahorros, meta mensual, productos más vendidos y actividad reciente
   * Si no hay usuario, retorna valores por defecto
   */
  const merchantStats = user ? getUserMetrics(user.id) : {
    totalOrders: 0,
    totalSpent: 0,
    totalSavings: 0,
    averageOrderValue: 0,
    monthlyGoal: 5000,
    monthlyProgress: 0,
    topProducts: [],
    recentActivity: [],
  };

  /**
   * Maneja la selección de imagen de perfil
   * Muestra un diálogo con dos opciones:
   * 1. Tomar foto: Abre el componente CameraView para capturar una foto con la cámara
   * 2. Elegir de galería: Solicita permisos y abre el selector de imágenes del dispositivo
   * Si el usuario cancela, no se realiza ninguna acción
   */
  const handleImagePicker = async () => {
    Alert.alert(
      'Seleccionar Foto',
      '¿Cómo deseas agregar tu foto?',
      [
        {
          text: 'Tomar Foto',
          onPress: () => setShowCamera(true),
        },
        {
          text: 'Elegir de Galería',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              await updateProfile({ profileImage: result.assets[0].uri });
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Procesa la foto capturada desde la cámara
   * Recibe la URI de la imagen y actualiza el perfil del usuario con la nueva foto
   * @param uri - Ruta de la imagen capturada
   */
  const handleCameraCapture = async (uri: string) => {
    await updateProfile({ profileImage: uri });
  };

  /**
   * Navega a la pantalla de edición de perfil
   * Permite al usuario modificar su información personal (nombre, email, etc.)
   */
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  /**
   * Navega a la pantalla de cambio de contraseña
   * Permite al usuario actualizar su contraseña de forma segura
   */
  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  /**
   * Maneja el cierre de sesión del usuario
   * Muestra un diálogo de confirmación antes de proceder
   * Al confirmar:
   * 1. Cierra la sesión del usuario (logout)
   * 2. Limpia el carrito de compras
   * 3. Redirige a la pantalla de login
   */
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            clearCart();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  /**
   * Maneja el cambio de estado de las notificaciones
   * Actualiza la preferencia de notificaciones del usuario en su perfil
   * Si la actualización falla, revierte el estado del switch y muestra un error
   * @param value - Nuevo estado de las notificaciones (true/false)
   */
  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    const success = await updateProfile({
      preferences: {
        notifications: value,
        theme: user?.preferences?.theme || 'auto'
      }
    });
    
    if (!success) {
      Alert.alert('Error', 'Error al actualizar las preferencias');
      setNotificationsEnabled(!value);
    }
  };

  /**
   * Validación: Si no hay usuario autenticado, muestra un mensaje de error
   * Esto previene errores al intentar acceder a propiedades del usuario
   */
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.light.error} />
          <Text style={styles.errorText}>Error: Usuario no encontrado</Text>
        </View>
      </View>
    );
  }

  /**
   * Calcula el porcentaje de progreso hacia la meta mensual
   * Si no hay meta definida, retorna 0%
   * El resultado se usa para mostrar la barra de progreso visual
   */
  const progressPercentage = merchantStats.monthlyGoal > 0 
    ? (merchantStats.monthlyProgress / merchantStats.monthlyGoal) * 100 
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 
        HEADER DEL PERFIL
        Muestra la foto de perfil del usuario (o un icono por defecto si no tiene foto),
        su nombre, email y un badge de "Comerciante Verificado" si está en modo mayorista.
        Incluye un botón para cambiar la foto de perfil que abre el selector de imágenes.
      */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Ionicons name="business" size={responsive({ xs: 32, sm: 36, md: 40 })} color={Colors.light.primary} />
            </View>
          )}
          <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
            <Ionicons name="camera" size={responsive({ xs: 12, sm: 14, md: 16 })} color={Colors.light.background} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {isWholesaleMode && (
            <View style={styles.merchantBadge}>
              <Ionicons name="business" size={responsive({ xs: 12, sm: 14, md: 16 })} color={Colors.light.primary} />
              <Text style={styles.merchantBadgeText}>Comerciante Verificado</Text>
            </View>
          )}
        </View>
      </View>

      {/* 
        DASHBOARD DE COMERCIANTE
        Muestra las métricas principales del negocio del usuario:
        - Total de pedidos realizados
        - Total gastado en todos los pedidos
        - Total ahorrado con precios mayoristas
        - Progreso hacia la meta mensual (barra de progreso)
        - Top 3 productos más vendidos (si hay datos)
        - Actividad reciente (últimas 3 acciones: pedidos, pagos, etc.)
      */}
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Dashboard de Negocio</Text>
        
        {/* Estadísticas principales: Pedidos, Gastado, Ahorrado */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="receipt" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.primary} />
            </View>
            <Text style={styles.statNumber}>{merchantStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cash" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.success} />
            </View>
            <Text style={styles.statNumber}>S/ {merchantStats.totalSpent.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Gastado</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-down" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.warning} />
            </View>
            <Text style={styles.statNumber}>S/ {merchantStats.totalSavings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Ahorrado</Text>
          </View>
        </View>

        {/* 
          PROGRESO MENSUAL
          Muestra una barra de progreso visual que indica cuánto ha gastado el usuario
          en relación a su meta mensual. Incluye el porcentaje completado.
        */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Meta Mensual</Text>
            <Text style={styles.progressValue}>
              S/ {merchantStats.monthlyProgress.toFixed(0)} / S/ {merchantStats.monthlyGoal.toFixed(0)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(progressPercentage, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {progressPercentage.toFixed(1)}% completado
          </Text>
        </View>

        {/* 
          PRODUCTOS MÁS VENDIDOS
          Muestra los top 3 productos que el usuario ha comprado más veces,
          incluyendo la cantidad de unidades y el ingreso generado por cada producto.
          Solo se muestra si hay productos en el historial.
        */}
        {merchantStats.topProducts.length > 0 && (
          <View style={styles.topProductsCard}>
            <Text style={styles.cardTitle}>Productos Más Vendidos</Text>
            {merchantStats.topProducts.slice(0, 3).map((product, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productQuantity}>{product.quantity} unidades</Text>
                </View>
                <Text style={styles.productRevenue}>S/ {product.revenue.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 
          ACTIVIDAD RECIENTE
          Muestra las últimas 3 acciones del usuario (pedidos, pagos, actualizaciones),
          con iconos, descripción, fecha y monto. Solo se muestra si hay actividad reciente.
        */}
        {merchantStats.recentActivity.length > 0 && (
          <View style={styles.activityCard}>
            <Text style={styles.cardTitle}>Actividad Reciente</Text>
            {merchantStats.recentActivity.slice(0, 3).map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons 
                    name={activity.type === 'order' ? 'receipt' : activity.type === 'payment' ? 'card' : 'refresh'} 
                    size={responsive({ xs: 14, sm: 16 })} 
                    color={Colors.light.primary} 
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityDescription} numberOfLines={1}>{activity.description}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text style={styles.activityAmount}>S/ {activity.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 
        SECCIÓN DE INFORMACIÓN PERSONAL
        Contiene opciones para gestionar la información del usuario:
        - Editar Perfil: Permite modificar nombre, email y otros datos personales
        - Cambiar Contraseña: Permite actualizar la contraseña de forma segura
      */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        {/* Botón para editar el perfil del usuario */}
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.primary} />
            </View>
            <Text style={styles.menuItemText}>Editar Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={responsive({ xs: 16, sm: 18, md: 20 })} color={Colors.light.textLight} />
        </TouchableOpacity>

        {/* Botón para cambiar la contraseña del usuario */}
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="lock-closed-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.primary} />
            </View>
            <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
          </View>
          <Ionicons name="chevron-forward" size={responsive({ xs: 16, sm: 18, md: 20 })} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      {/* 
        SECCIÓN DE PREFERENCIAS
        Permite al usuario configurar sus preferencias de la aplicación:
        - Notificaciones: Activar/desactivar las notificaciones push
        - Modo Oscuro: Cambiar entre tema claro y oscuro (actualmente no implementado)
      */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        {/* Switch para activar/desactivar notificaciones */}
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.primary} />
            </View>
            <Text style={styles.menuItemText}>Notificaciones</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
            thumbColor={notificationsEnabled ? Colors.light.background : Colors.light.textLight}
          />
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="moon-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.secondary} />
            </View>
            <Text style={styles.menuItemText}>Modo Oscuro</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: Colors.light.border, true: Colors.light.secondary }}
            thumbColor={false ? Colors.light.textLight : Colors.light.background}
          />
        </View>
      </View>

      {/* 
        SECCIÓN DE SOPORTE
        Proporciona acceso a recursos de ayuda y soporte:
        - Ayuda: Documentación y guías de uso
        - Contacto: Formulario o información de contacto
        - Acerca de: Información sobre la aplicación y versión
        Nota: Estas opciones actualmente no tienen funcionalidad implementada
      */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        
        {/* Opción de ayuda (pendiente de implementar) */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.success} />
            </View>
            <Text style={styles.menuItemText}>Ayuda</Text>
          </View>
          <Ionicons name="chevron-forward" size={responsive({ xs: 16, sm: 18, md: 20 })} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="mail-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.success} />
            </View>
            <Text style={styles.menuItemText}>Contacto</Text>
          </View>
          <Ionicons name="chevron-forward" size={responsive({ xs: 16, sm: 18, md: 20 })} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="information-circle-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.success} />
            </View>
            <Text style={styles.menuItemText}>Acerca de</Text>
          </View>
          <Ionicons name="chevron-forward" size={responsive({ xs: 16, sm: 18, md: 20 })} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      {/* 
        BOTÓN DE CERRAR SESIÓN
        Permite al usuario cerrar su sesión de forma segura.
        Muestra un diálogo de confirmación antes de proceder.
        Al confirmar, limpia la sesión y el carrito, y redirige al login.
      */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={responsive({ xs: 20, sm: 22, md: 24 })} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Espaciado inferior */}
      <View style={styles.bottomSpacing} />

      {/* 
        COMPONENTE DE CÁMARA
        Modal que se muestra cuando el usuario elige "Tomar Foto" para su perfil.
        Permite capturar una foto con la cámara del dispositivo.
        Al capturar, se actualiza automáticamente la foto de perfil del usuario.
      */}
      <CameraView
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        type="profile"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.light.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },

  // Header
  header: {
    backgroundColor: Colors.light.backgroundCard,
    paddingTop: responsive({ xs: 50, sm: 60, md: 70 }),
    paddingBottom: responsive({ xs: 24, sm: 28, md: 32 }),
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: responsive({ xs: 80, sm: 90, md: 100 }),
    height: responsive({ xs: 80, sm: 90, md: 100 }),
    borderRadius: responsive({ xs: 40, sm: 45, md: 50 }),
  },
  defaultProfileImage: {
    width: responsive({ xs: 80, sm: 90, md: 100 }),
    height: responsive({ xs: 80, sm: 90, md: 100 }),
    borderRadius: responsive({ xs: 40, sm: 45, md: 50 }),
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: responsive({ xs: 12, sm: 14, md: 15 }),
    width: responsive({ xs: 24, sm: 28, md: 30 }),
    height: responsive({ xs: 24, sm: 28, md: 30 }),
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: responsive({ xs: 20, sm: 22, md: 24 }),
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  email: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  merchantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  merchantBadgeText: {
    fontSize: responsive({ xs: 10, sm: 11, md: 12 }),
    color: Colors.light.primary,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },

  // Dashboard section
  dashboardSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: responsive({ xs: 18, sm: 20, md: 22 }),
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIconContainer: {
    width: responsive({ xs: 36, sm: 40, md: 44 }),
    height: responsive({ xs: 36, sm: 40, md: 44 }),
    borderRadius: responsive({ xs: 18, sm: 20, md: 22 }),
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: responsive({ xs: 16, sm: 18, md: 20 }),
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: responsive({ xs: 10, sm: 11, md: 12 }),
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Progress card
  progressCard: {
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: responsive({ xs: 16, sm: 17, md: 18 }),
    fontWeight: '600',
    color: Colors.light.text,
  },
  progressValue: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  progressBar: {
    height: responsive({ xs: 6, sm: 7, md: 8 }),
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
  },
  progressPercentage: {
    fontSize: responsive({ xs: 12, sm: 13, md: 14 }),
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Cards
  topProductsCard: {
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  activityCard: {
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: responsive({ xs: 16, sm: 17, md: 18 }),
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },

  // Product items
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  productInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  productName: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.text,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  productQuantity: {
    fontSize: responsive({ xs: 12, sm: 13, md: 14 }),
    color: Colors.light.textSecondary,
  },
  productRevenue: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.success,
    fontWeight: '600',
  },

  // Activity items
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  activityIcon: {
    width: responsive({ xs: 32, sm: 36, md: 40 }),
    height: responsive({ xs: 32, sm: 36, md: 40 }),
    borderRadius: responsive({ xs: 16, sm: 18, md: 20 }),
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  activityDescription: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.text,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  activityDate: {
    fontSize: responsive({ xs: 12, sm: 13, md: 14 }),
    color: Colors.light.textSecondary,
  },
  activityAmount: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.success,
    fontWeight: '600',
  },

  // Sections
  section: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: responsive({ xs: 36, sm: 40, md: 44 }),
    height: responsive({ xs: 36, sm: 40, md: 44 }),
    borderRadius: responsive({ xs: 18, sm: 20, md: 22 }),
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.text,
    fontWeight: '500',
  },

  // Logout section
  logoutSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.light.backgroundCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.error,
    ...Shadows.sm,
  },
  logoutButtonText: {
    fontSize: responsive({ xs: 14, sm: 15, md: 16 }),
    color: Colors.light.error,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },

  // Bottom spacing
  bottomSpacing: {
    height: responsive({ xs: 20, sm: 24, md: 28 }),
  },
});