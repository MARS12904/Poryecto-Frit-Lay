# 🧪 Guía de Prueba: Envío de Emails con Resend

## ✅ Configuración Completada

Ya tienes configurado:
- ✅ API Key de Resend configurada
- ✅ Modo desarrollo desactivado
- ✅ Código listo para enviar emails reales

## 📋 Pasos para Probar

### Paso 1: Verificar que la App esté Ejecutándose

```bash
cd LayGoProy
npm start
```

O si ya está corriendo, asegúrate de que esté activa.

### Paso 2: Iniciar Sesión en la App

Usa uno de estos usuarios de prueba (o crea uno nuevo):

**Opción 1: Usuario Administrador**
- Email: `admin@fritolay.com`
- Contraseña: `admin123`

**Opción 2: Comerciante 1**
- Email: `comerciante1@test.com`
- Contraseña: `comerciante123`

**Opción 3: Comerciante 2**
- Email: `comerciante2@test.com`
- Contraseña: `tienda123`

**⚠️ IMPORTANTE:** El email que uses debe ser **real y accesible** para recibir el correo de prueba.

### Paso 3: Agregar Productos al Carrito

1. Ve a la pestaña **"Catálogo"**
2. Agrega algunos productos al carrito
3. Ve a la pestaña **"Carrito"**
4. Verifica que los productos estén ahí

### Paso 4: Completar el Pago

1. En el carrito, haz clic en **"Proceder al Pago"**
2. Selecciona un método de pago (ej: "Efectivo contra Entrega")
3. Completa los datos si es necesario
4. Haz clic en **"Pagar"**
5. Confirma el pago

### Paso 5: Verificar el Envío

#### En la Consola de la App

Deberías ver mensajes como:

```
✅ Email enviado exitosamente a: comerciante1@test.com
   ID de Resend: re_xxxxxxxxxxxxx
📧 Correo de confirmación enviado a: comerciante1@test.com
```

#### En tu Bandeja de Entrada

1. Abre el email que usaste para iniciar sesión
2. Busca un email con asunto: **"✅ Confirmación de Pedido FL-XXXX-XXXX-XXX - Frito-Lay Perú"**
3. Revisa que el email tenga:
   - ✅ Número de pedido
   - ✅ Lista de productos
   - ✅ Total del pedido
   - ✅ Información de entrega (si aplica)

#### En el Dashboard de Resend

1. Ve a [resend.com/dashboard](https://resend.com/dashboard)
2. Haz clic en **"Emails"** en el menú lateral
3. Verás todos los emails enviados con:
   - Estado (enviado, entregado, etc.)
   - Destinatario
   - Fecha y hora
   - ID del email

## 🔍 Verificar Errores

### Si NO recibes el email:

1. **Revisa la consola de la app** - Busca errores en rojo
2. **Revisa el Dashboard de Resend** - Ve si hay errores
3. **Verifica la carpeta de SPAM** - A veces los emails van ahí
4. **Verifica el email del usuario** - Asegúrate de que sea un email real

### Errores Comunes:

#### Error: "Unauthorized"
- **Causa:** API Key inválida o expirada
- **Solución:** Genera una nueva API key en Resend

#### Error: "Invalid 'from' address"
- **Causa:** El dominio no está verificado
- **Solución:** Usa `onboarding@resend.dev` (ya está configurado)

#### Error: "Rate limit exceeded"
- **Causa:** Has enviado demasiados emails
- **Solución:** Espera unos minutos o verifica tu plan de Resend

## 📊 Qué Buscar en el Email

El email debe incluir:

✅ **Header con colores de Frito-Lay** (rojo)
✅ **Saludo personalizado** con el nombre del usuario
✅ **Número de pedido** (formato: FL-YYYY-MMDD-XXX)
✅ **Fecha del pedido**
✅ **Estado del pedido** (Pendiente)
✅ **Tabla con productos:**
   - Nombre del producto
   - Marca
   - Cantidad
   - Precio unitario
   - Subtotal
✅ **Resumen financiero:**
   - Subtotal
   - Descuento mayorista (si aplica)
   - Total
✅ **Información de entrega** (si se programó)
✅ **Método de pago**
✅ **Footer con información de la empresa**

## 🎯 Prueba Rápida (Alternativa)

Si quieres probar sin completar todo el flujo, puedes crear un script de prueba temporal:

1. Crea un archivo `test-email.ts` (temporal):

```typescript
import { sendOrderConfirmationEmail } from './utils/email-service';
import { Order } from './contexts/OrdersContext';

// Pedido de prueba
const testOrder: Order = {
  id: 'FL-2024-0115-001',
  date: new Date().toISOString().split('T')[0],
  status: 'pending',
  total: 150.50,
  wholesaleTotal: 120.00,
  savings: 30.50,
  items: [
    {
      id: 'lays-clasico-150g',
      name: "Lay's Clásico",
      brand: "Lay's",
      quantity: 12,
      unitPrice: 3.20,
      subtotal: 38.40,
      weight: '150g'
    }
  ],
  paymentMethod: 'Efectivo contra Entrega',
  isWholesale: true,
  userId: 'test-user-id',
  deliveryAddress: 'Av. Principal 123, Lima',
  deliveryDate: '2024-01-20',
  deliveryTimeSlot: '09:00 - 12:00'
};

// Enviar email de prueba
sendOrderConfirmationEmail(
  testOrder,
  'tu-email-real@ejemplo.com', // ⚠️ Cambia por tu email real
  'Nombre de Prueba'
).then(success => {
  console.log('Email enviado:', success);
});
```

2. Ejecuta el script (solo para pruebas)

## ✅ Checklist de Prueba

- [ ] App ejecutándose
- [ ] Usuario iniciado con email real
- [ ] Productos agregados al carrito
- [ ] Pago completado
- [ ] Mensaje de éxito en consola
- [ ] Email recibido en bandeja de entrada
- [ ] Email verificado en Dashboard de Resend
- [ ] Contenido del email correcto

## 🐛 Debugging

### Ver Logs Detallados

El código ya incluye logs. Busca en la consola:

- `✅ Email enviado exitosamente` - Todo funcionó
- `❌ Error al enviar email` - Hubo un problema
- `ID de Resend: re_xxxxx` - ID del email en Resend

### Verificar en Resend Dashboard

1. Ve a [resend.com/dashboard/emails](https://resend.com/dashboard/emails)
2. Verás:
   - **Estado:** Enviado, Entregado, Rebotado, etc.
   - **Destinatario:** Email al que se envió
   - **Fecha:** Cuándo se envió
   - **Detalles:** Puedes ver el contenido del email

## 🎉 ¡Listo!

Si recibiste el email, ¡todo está funcionando correctamente! 

**Próximos pasos:**
- Personaliza el diseño del email si quieres
- Configura tu propio dominio en Resend (opcional)
- Mueve la API key a variables de entorno para producción

---

**¿Problemas?** Revisa la consola de la app y el dashboard de Resend para ver qué está pasando.

