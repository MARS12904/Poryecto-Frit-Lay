import { UserStorage } from './userStorage';

// Función para crear usuarios de prueba
export const seedTestUsers = async (): Promise<void> => {
  try {
    // Verificar si ya existen usuarios
    const existingUsers = await UserStorage.getRegisteredUsers();
    if (existingUsers.length > 0) {
      console.log('Ya existen usuarios registrados, no se crearán usuarios de prueba');
      return;
    }

    // Crear usuarios de prueba
    const testUsers = [
      {
        email: 'admin@fritolay.com',
        name: 'Administrador Frito-Lay',
        phone: '+51987654321',
        password: 'admin123',
        preferences: {
          notifications: true,
          theme: 'auto' as const
        }
      },
      {
        email: 'comerciante1@test.com',
        name: 'Juan Pérez - Comerciante',
        phone: '+51987654322',
        password: 'comerciante123',
        preferences: {
          notifications: true,
          theme: 'light' as const
        }
      },
      {
        email: 'comerciante2@test.com',
        name: 'María García - Tienda El Sol',
        phone: '+51987654323',
        password: 'tienda123',
        preferences: {
          notifications: false,
          theme: 'dark' as const
        }
      }
    ];

    for (const userData of testUsers) {
      try {
        await UserStorage.registerUser(userData);
        console.log(`Usuario de prueba creado: ${userData.email}`);
      } catch (error) {
        console.error(`Error creando usuario ${userData.email}:`, error);
      }
    }

    console.log('Usuarios de prueba creados exitosamente');
  } catch (error) {
    console.error('Error creando usuarios de prueba:', error);
  }
};

// Función para limpiar todos los usuarios (solo para desarrollo)
export const clearAllUsers = async (): Promise<void> => {
  try {
    await UserStorage.saveRegisteredUsers([]);
    await UserStorage.clearCurrentUser();
    console.log('Todos los usuarios han sido eliminados');
  } catch (error) {
    console.error('Error limpiando usuarios:', error);
  }
};

// Función para mostrar estadísticas de usuarios
export const showUserStats = async (): Promise<void> => {
  try {
    const stats = await UserStorage.getUserStats();
    const users = await UserStorage.getRegisteredUsers();
    
    console.log('=== Estadísticas de Usuarios ===');
    console.log(`Total de usuarios: ${stats.totalUsers}`);
    console.log(`Logins recientes (última semana): ${stats.recentLogins}`);
    console.log(`Último registro: ${stats.lastRegistration || 'N/A'}`);
    console.log('\n=== Usuarios Registrados ===');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Registrado: ${user.createdAt}`);
      console.log(`   Último login: ${user.lastLogin || 'Nunca'}`);
    });
  } catch (error) {
    console.error('Error mostrando estadísticas:', error);
  }
};
