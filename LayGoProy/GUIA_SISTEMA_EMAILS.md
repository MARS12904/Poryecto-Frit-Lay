# 📧 Guía del Sistema de Emails

## Descripción

El sistema de emails envía correos de confirmación automáticos a los usuarios cuando:
1. **Se crea un nuevo pedido** - Al completar el proceso de pago
2. **El pedido se marca como entregado** - Cuando cambia el estado a "delivered"

## 📂 Archivos

- **Servicio de Email:** `utils/email-service.ts`
- **Integración en Pagos:** `app/payments/index.tsx` (línea ~153)
- **Integración en Estados:** `contexts/OrdersContext.tsx` (línea ~155)

## 🎯 Funcionalidad Actual

### En Desarrollo (__DEV__)
- **Simula el envío de emails** - Muestra información en la consola
- **No envía emails reales** - Ideal para desarrollo y pruebas
- **Genera emails HTML** - Crea contenido HTML formateado con todos los detalles

### En Producción
- **Actualmente simula** - Listo para integrarse con un servicio real
- **Requiere configuración** - Necesita integrarse con un servicio de email

## 📧 Contenido del Email

El email incluye:
- ✅ Número de pedido
- ✅ Fecha del pedido
- ✅ Estado actual
- ✅ Lista completa de productos con cantidades y precios
- ✅ Información de entrega (si aplica)
- ✅ Resumen financiero (subtotal, descuentos, total)
- ✅ Número de seguimiento (si está disponible)
- ✅ Método de pago utilizado

## 🔧 Integración con Servicios de Email

Para enviar emails reales en producción, necesitas integrar uno de estos servicios:

### Opción 1: SendGrid (Recomendado)

```typescript
// En utils/email-service.ts, función sendEmail()
import fetch from 'node-fetch'; // O usar fetch nativo

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: options.to }]
        }],
        from: { email: 'noreply@fritolayperu.com', name: 'Frito-Lay Perú' },
        subject: options.subject,
        content: [
          { type: 'text/plain', value: options.text || '' },
          { type: 'text/html', value: options.html }
        ]
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}
```

### Opción 2: AWS SES

```typescript
// Requiere: npm install @aws-sdk/client-ses
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'us-east-1' });

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const command = new SendEmailCommand({
      Source: 'noreply@fritolayperu.com',
      Destination: { ToAddresses: [options.to] },
      Message: {
        Subject: { Data: options.subject },
        Body: {
          Text: { Data: options.text || '' },
          Html: { Data: options.html }
        }
      }
    });
    
    await sesClient.send(command);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}
```

### Opción 3: Resend (Moderno y Simple)

```typescript
// Requiere: npm install resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'Frito-Lay Perú <noreply@fritolayperu.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}
```

### Opción 4: Backend API Propia

Crear un endpoint en tu backend que envíe emails:

```typescript
// En utils/email-service.ts
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('https://api.tu-backend.com/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`, // Si requiere auth
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# SendGrid
SENDGRID_API_KEY=tu_api_key_aqui

# O AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key

# O Resend
RESEND_API_KEY=tu_api_key_aqui

# Email del remitente
EMAIL_FROM=noreply@fritolayperu.com
EMAIL_FROM_NAME=Frito-Lay Perú
```

### Instalación de Dependencias

Dependiendo del servicio que elijas:

```bash
# SendGrid
npm install @sendgrid/mail

# AWS SES
npm install @aws-sdk/client-ses

# Resend
npm install resend

# Para variables de entorno
npm install react-native-dotenv
# O usar expo-constants si estás en Expo
```

## 🧪 Pruebas

### En Desarrollo

Cuando ejecutas la app en modo desarrollo, verás en la consola:

```
📧 [EMAIL SIMULADO] Enviando correo:
  Para: usuario@ejemplo.com
  Asunto: ✅ Confirmación de Pedido FL-2024-0115-001 - Frito-Lay Perú
  Contenido HTML generado ( 5234 caracteres)
```

### Pruebas con Email Real

Para probar con emails reales sin cambiar a producción:

1. Comentar la condición `if (__DEV__)`
2. Configurar las variables de entorno
3. Usar un servicio como Mailtrap para pruebas

```typescript
// Temporalmente para pruebas
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Comentar esta línea para pruebas reales
  // if (__DEV__) { ... }
  
  // Código de producción aquí
}
```

## 📝 Cuándo se Envían los Emails

### 1. Al Crear un Pedido

**Ubicación:** `app/payments/index.tsx` → `processPayment()`

```typescript
// Después de crear el pedido
const order = await addOrder({...});

// Enviar correo
if (user.email) {
  await sendOrderConfirmationEmail(order, user.email, user.name);
}
```

### 2. Al Marcar Pedido como Entregado

**Ubicación:** `contexts/OrdersContext.tsx` → `updateOrderStatus()`

```typescript
// Cuando el estado cambia a 'delivered'
if (status === 'delivered' && updatedOrder) {
  const user = await UserStorage.getUserById(updatedOrder.userId);
  if (user && user.email) {
    await sendOrderConfirmationEmail(updatedOrder, user.email, user.name);
  }
}
```

## 🎨 Personalización del Email

Para modificar el diseño del email, edita la función `generateOrderConfirmationEmail()` en `utils/email-service.ts`.

### Cambiar Colores

```typescript
// Buscar y reemplazar
background: linear-gradient(135deg, #E31E24 0%, #C4161A 100%);
// Con tus colores
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
```

### Agregar Logo

```typescript
// En el header del email
<img src="https://tu-dominio.com/logo.png" alt="Frito-Lay Perú" style="max-width: 200px;" />
```

### Modificar Texto

Edita los strings en español dentro de `generateOrderConfirmationEmail()` y `generateOrderConfirmationEmailText()`.

## 🚨 Manejo de Errores

El sistema está diseñado para **no bloquear** el proceso si falla el envío del email:

```typescript
try {
  await sendOrderConfirmationEmail(order, user.email, user.name);
  console.log('📧 Correo enviado');
} catch (error) {
  console.error('Error al enviar correo:', error);
  // El proceso continúa normalmente
}
```

Esto asegura que:
- ✅ Los pedidos se procesen aunque falle el email
- ✅ El usuario no vea errores innecesarios
- ✅ Los errores se registren para debugging

## 📊 Monitoreo

Para monitorear el envío de emails en producción:

1. **Logs**: Revisa los logs de tu servicio de email
2. **Analytics**: Integra con servicios como Mixpanel o Amplitude
3. **Dashboard**: Usa el dashboard del servicio de email (SendGrid, Resend, etc.)

## ✅ Checklist de Implementación en Producción

- [ ] Elegir servicio de email (SendGrid, AWS SES, Resend, etc.)
- [ ] Configurar cuenta y obtener API keys
- [ ] Agregar variables de entorno
- [ ] Instalar dependencias necesarias
- [ ] Actualizar función `sendEmail()` en `email-service.ts`
- [ ] Probar envío de emails de prueba
- [ ] Verificar dominio remitente (SPF, DKIM, DMARC)
- [ ] Configurar límites de envío y rate limiting
- [ ] Implementar manejo de bounces y quejas
- [ ] Configurar monitoreo y alertas

## 🔗 Enlaces Útiles

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Resend Documentation](https://resend.com/docs)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)

---

**Nota:** En desarrollo, los emails se simulan. En producción, debes integrar un servicio real de email para que funcione correctamente.

