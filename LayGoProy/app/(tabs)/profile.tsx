import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  return <ProfileContent />;
}

function ProfileContent() {
  const { user, updateProfile, logout } = useAuth();
  const { totalItems, totalPrice, clearCart, isWholesaleMode } = useCart();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notifications ?? true
  );

  // Datos simulados del dashboard de comerciante
  const merchantStats = {
    totalOrders: 24,
    totalSpent: 2847.50,
    totalSavings: 456.30,
    averageOrderValue: 118.65,
    lastOrderDate: '2024-01-28',
    favoriteBrand: 'Lay\'s',
    monthlyGoal: 5000,
    monthlyProgress: 2847.50,
    topProducts: [
      { name: 'Lay\'s Clásicas', quantity: 120, revenue: 336.00 },
      { name: 'Doritos Nacho', quantity: 85, revenue: 280.50 },
      { name: 'Cheetos Queso', quantity: 78, revenue: 249.60 },
    ],
    recentActivity: [
      { type: 'order', description: 'Pedido FL-2024-004 entregado', date: '2024-01-28', amount: 67.20 },
      { type: 'payment', description: 'Pago procesado exitosamente', date: '2024-01-25', amount: 45.60 },
      { type: 'reorder', description: 'Reordenaste productos populares', date: '2024-01-22', amount: 89.40 },
    ]
  };

  const handleImagePicker = async () => {
    // Esta funcionalidad se implementaría con expo-image-picker
    Alert.alert('Función en desarrollo', 'La selección de imagen estará disponible pronto');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

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

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    const success = await updateProfile({
      preferences: {
        ...user?.preferences,
        notifications: value
      }
    });
    
    if (!success) {
      Alert.alert('Error', 'Error al actualizar las preferencias');
      setNotificationsEnabled(!value);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Error: Usuario no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Ionicons name="business" size={40} color={Colors.light.primary} />
            </View>
          )}
          <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
            <Ionicons name="camera" size={16} color={Colors.light.background} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {isWholesaleMode && (
          <View style={styles.merchantBadge}>
            <Ionicons name="business" size={16} color={Colors.light.primary} />
            <Text style={styles.merchantBadgeText}>Comerciante Verificado</Text>
          </View>
        )}
      </View>

      {/* Dashboard de comerciante */}
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Dashboard de Negocio</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="receipt" size={24} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{merchantStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={24} color={Colors.light.success} />
            <Text style={styles.statNumber}>S/ {merchantStats.totalSpent.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Gastado</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-down" size={24} color={Colors.light.warning} />
            <Text style={styles.statNumber}>S/ {merchantStats.totalSavings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Ahorrado</Text>
          </View>
        </View>

        {/* Progreso mensual */}
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
                { width: `${(merchantStats.monthlyProgress / merchantStats.monthlyGoal) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {((merchantStats.monthlyProgress / merchantStats.monthlyGoal) * 100).toFixed(1)}% completado
          </Text>
        </View>

        {/* Productos top */}
        <View style={styles.topProductsCard}>
          <Text style={styles.cardTitle}>Productos Más Vendidos</Text>
          {merchantStats.topProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>{product.quantity} unidades</Text>
              </View>
              <Text style={styles.productRevenue}>S/ {product.revenue.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Actividad reciente */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Actividad Reciente</Text>
          {merchantStats.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons 
                  name={activity.type === 'order' ? 'receipt' : activity.type === 'payment' ? 'card' : 'refresh'} 
                  size={16} 
                  color={Colors.light.primary} 
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text style={styles.activityAmount}>S/ {activity.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.menuItemText}>Editar Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.menuItemText}>Notificaciones</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
            thumbColor={notificationsEnabled ? Colors.light.background : Colors.light.textLight}
          />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="moon-outline" size={24} color={Colors.light.secondary} />
            <Text style={styles.menuItemText}>Modo Oscuro</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: Colors.light.border, true: Colors.light.secondary }}
            thumbColor={false ? Colors.light.textLight : Colors.light.background}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.light.success} />
            <Text style={styles.menuItemText}>Ayuda</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="mail-outline" size={24} color={Colors.light.success} />
            <Text style={styles.menuItemText}>Contacto</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.light.success} />
            <Text style={styles.menuItemText}>Acerca de</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});
