# 🚀 Guía Rápida: Configurar Resend para Enviar Emails Reales

## ¿Por qué Resend?

✅ **Gratis:** 3,000 emails/mes gratis  
✅ **Rápido:** Configuración en 5 minutos  
✅ **Simple:** API REST fácil de usar  
✅ **Sin dependencias:** Usa fetch nativo (no necesita npm install)  
✅ **Moderno:** Diseñado para desarrolladores

## 📋 Pasos para Configurar (5 minutos)

### Paso 1: Crear Cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en **"Sign Up"** (Registrarse)
3. Crea tu cuenta (puedes usar Google/GitHub para más rápido)
4. **Verifica tu email**

### Paso 2: Obtener tu API Key

1. Una vez dentro del dashboard, ve a **"API Keys"** en el menú lateral
2. Haz clic en **"Create API Key"**
3. Dale un nombre (ej: "Frito-Lay App")
4. Selecciona permisos: **"Full Access"** (o solo "Send emails")
5. Haz clic en **"Create"**
6. **¡COPIA LA API KEY INMEDIATAMENTE!** (solo se muestra una vez)

### Paso 3: Configurar en tu Proyecto

#### ⚡ Opción Rápida (Recomendada para empezar)

Para probar rápidamente, edita temporalmente `utils/email-service.ts`:

1. Abre `LayGoProy/utils/email-service.ts`
2. Busca la línea que dice:
```typescript
const resendApiKey = process.env.RESEND_API_KEY || process.env.EXPO_PUBLIC_RESEND_API_KEY;
```

3. Reemplázala temporalmente con:
```typescript
// TEMPORAL - Reemplaza con tu API key de Resend
const resendApiKey = 're_tu_api_key_de_resend_aqui';
```

**⚠️ IMPORTANTE:** 
- Reemplaza `re_tu_api_key_de_resend_aqui` con tu API key real de Resend
- **NO subas esto a Git** - Es solo para pruebas

#### Opción A: Variables de Entorno (Para Producción)

**Para React Native/Expo, la mejor opción es usar un backend API** que maneje el envío de emails de forma segura. Las API keys no deben estar en el código del cliente.

**Alternativa temporal con Expo:**

1. Crea un archivo `.env` en la raíz del proyecto `LayGoProy/`:

```env
EXPO_PUBLIC_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Instala `react-native-dotenv`:

```bash
cd LayGoProy
npm install react-native-dotenv
npm install --save-dev @types/react-native-dotenv
```

3. Configura en `babel.config.js` o `metro.config.js`

**⚠️ NOTA DE SEGURIDAD:** 
- En React Native, las variables `EXPO_PUBLIC_*` se exponen al cliente
- Para producción, **usa un backend API** que maneje el envío de emails

#### Opción B: Backend API (Recomendado para Producción)

Crea un endpoint en tu backend:

```typescript
// Backend API endpoint
POST /api/email/send
Body: { to, subject, html, text }

// El backend usa Resend con la API key segura
```

Luego actualiza `sendEmail()` para llamar a tu backend en lugar de Resend directamente.

### Paso 4: Verificar Dominio (Opcional - para Producción)

Para usar tu propio dominio (ej: noreply@fritolayperu.com):

1. Ve a **"Domains"** en Resend
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `fritolayperu.com`)
4. Agrega los registros DNS que te indica Resend
5. Espera a que se verifique (puede tomar hasta 48 horas)

**Para pruebas:** Puedes usar el dominio por defecto `@resend.dev` sin configuración.

## 🧪 Probar el Envío

### Método 1: Probar en Desarrollo

1. **Momentáneamente** desactiva el modo desarrollo para probar:

En `utils/email-service.ts`, comenta temporalmente:

```typescript
// if (__DEV__) {
//   console.log('📧 [EMAIL SIMULADO]...');
//   return true;
// }
```

2. Configura tu API key
3. Completa un pedido en la app
4. Verifica tu bandeja de entrada

### Método 2: Verificar en Resend Dashboard

1. Ve a **"Emails"** en el dashboard de Resend
2. Verás todos los emails enviados
3. Puedes ver el estado: enviado, entregado, errores, etc.

## 📧 Configuración del Remitente

Por defecto, el email se enviará desde: `Frito-Lay Perú <onboarding@resend.dev>`

Para cambiar el remitente, actualiza las variables de entorno:

```env
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME=Frito-Lay Perú
```

## 🔒 Seguridad

### ✅ Buenas Prácticas:

1. **NUNCA** subas tu API key a Git
2. Usa variables de entorno
3. Rota tus API keys periódicamente
4. Usa permisos mínimos en producción

### 🛡️ Archivo .gitignore

Asegúrate de que tu `.gitignore` incluya:

```
.env
.env.local
.env.production
```

## 🐛 Solución de Problemas

### Error: "API key is missing"

**Solución:** Verifica que `RESEND_API_KEY` esté configurada correctamente.

### Error: "Unauthorized"

**Solución:** Tu API key es inválida. Genera una nueva en Resend.

### Error: "Invalid 'from' address"

**Solución:** 
- Usa un dominio verificado, o
- Usa el dominio por defecto `@resend.dev` para pruebas

### Los emails no se envían en desarrollo

**Razón:** En `__DEV__` el sistema simula el envío.

**Solución:** Temporalmente comenta la condición `if (__DEV__)` para probar.

## 📊 Límites del Plan Gratuito

- ✅ **3,000 emails/mes** gratis
- ✅ Sin límite de destinatarios por email
- ✅ Analytics básico
- ✅ API completa
- ✅ Soporte por email

**Para más:** El plan Pro cuesta $20/mes y incluye 50,000 emails.

## ✅ Checklist de Configuración

- [ ] Cuenta creada en Resend
- [ ] API Key generada y copiada
- [ ] API Key configurada en `.env` (o código temporal)
- [ ] Archivo `.env` añadido a `.gitignore`
- [ ] Prueba de envío realizada
- [ ] Email recibido en bandeja de entrada

## 🎯 Próximos Pasos

Una vez configurado:

1. **Prueba completa:** Crea un pedido y verifica el email
2. **Personaliza:** Modifica el diseño del email en `utils/email-service.ts`
3. **Monitorea:** Revisa el dashboard de Resend para ver estadísticas
4. **Producción:** Configura tu dominio propio cuando estés listo

## 🔗 Enlaces Útiles

- [Resend Dashboard](https://resend.com/dashboard)
- [Resend Documentation](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference/emails/send-email)

---

**¿Listo?** En 5 minutos puedes tener emails reales funcionando. 🚀

