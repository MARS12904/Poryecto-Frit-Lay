# 📸 Guía para Agregar Imágenes de Productos

## 🎯 Objetivo
Esta guía te explica cómo agregar las imágenes reales de los productos Frito-Lay a la aplicación.

## 📁 Estructura de Carpetas

Crea la siguiente estructura de carpetas en tu proyecto:

```
LayGoProy/assets/images/products/
├── lays-classic-150g.png
├── lays-queso-150g.png
├── lays-cebolla-150g.png
├── lays-barbacoa-150g.png
├── doritos-nacho-150g.png
├── doritos-cool-ranch-150g.png
├── doritos-flamas-150g.png
├── cheetos-queso-150g.png
├── cheetos-puffs-150g.png
├── ruffles-queso-150g.png
├── ruffles-crema-150g.png
├── fritos-original-150g.png
├── tostitos-salsa-verde-150g.png
├── sabritas-adobadas-150g.png
└── gatorade-naranja-500ml.png
```

## 📋 Lista de Productos y Nombres de Archivo

### Lay's
- **Lay's Clásicas** → `lays-classic-150g.png`
- **Lay's Queso** → `lays-queso-150g.png`
- **Lay's Cebolla** → `lays-cebolla-150g.png`
- **Lay's Barbacoa** → `lays-barbacoa-150g.png`

### Doritos
- **Doritos Nacho Cheese** → `doritos-nacho-150g.png`
- **Doritos Cool Ranch** → `doritos-cool-ranch-150g.png`
- **Doritos Flamas** → `doritos-flamas-150g.png`

### Cheetos
- **Cheetos Queso** → `cheetos-queso-150g.png`
- **Cheetos Puffs** → `cheetos-puffs-150g.png`

### Ruffles
- **Ruffles Queso** → `ruffles-queso-150g.png`
- **Ruffles Crema y Cebolla** → `ruffles-crema-150g.png`

### Otros
- **Fritos Original** → `fritos-original-150g.png`
- **Tostitos Salsa Verde** → `tostitos-salsa-verde-150g.png`
- **Sabritas Adobadas** → `sabritas-adobadas-150g.png`
- **Gatorade Naranja** → `gatorade-naranja-500ml.png`

## 🖼️ Especificaciones de Imágenes

### Tamaño Recomendado
- **Dimensiones**: 400x400 píxeles (cuadradas)
- **Formato**: PNG (preferible) o JPG
- **Peso**: Máximo 200KB por imagen
- **Fondo**: Preferiblemente transparente o blanco

### Calidad
- **Resolución**: Mínimo 300 DPI
- **Enfoque**: Imagen nítida y clara
- **Iluminación**: Buena iluminación, sin sombras fuertes
- **Ángulo**: Frontal del producto

## 🔧 Pasos para Implementar

### Paso 1: Crear la Carpeta
```bash
mkdir -p LayGoProy/assets/images/products
```

### Paso 2: Agregar las Imágenes
Coloca todas las imágenes en la carpeta `LayGoProy/assets/images/products/` con los nombres exactos de la lista anterior.

### Paso 3: Descomentar las Importaciones
En el archivo `LayGoProy/data/productImages.ts`, descomenta las líneas de importación:

```typescript
// Cambiar esto:
// import laysClassic from '../assets/images/products/lays-classic-150g.png';

// Por esto:
import laysClassic from '../assets/images/products/lays-classic-150g.png';
```

### Paso 4: Descomentar el Mapeo Local
En el mismo archivo, descomenta el objeto `LOCAL_IMAGES`:

```typescript
// Cambiar esto:
// const LOCAL_IMAGES = {
//   'lays-classic-150g': laysClassic,
//   // ... resto de productos
// };

// Por esto:
const LOCAL_IMAGES = {
  'lays-classic-150g': laysClassic,
  'lays-queso-150g': laysQueso,
  // ... resto de productos
};
```

### Paso 5: Cambiar a Imágenes Locales
En la función `getProductImage`, cambia el parámetro por defecto:

```typescript
// Cambiar esto:
export const getProductImage = (productId: string, useLocal: boolean = false): string => {

// Por esto:
export const getProductImage = (productId: string, useLocal: boolean = true): string => {
```

## 🚀 Alternativas Rápidas

### Opción 1: Usar URLs de Imágenes Externas
Si no tienes las imágenes locales, puedes usar URLs de imágenes de internet. Edita el archivo `productImages.ts` y reemplaza las URLs en el objeto `PRODUCT_IMAGES`.

### Opción 2: Generar Placeholders Mejorados
Puedes usar servicios como:
- **Unsplash**: `https://images.unsplash.com/photo-[ID]?w=400&h=400&fit=crop`
- **Pexels**: `https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?w=400&h=400&fit=crop`
- **Lorem Picsum**: `https://picsum.photos/400/400`

### Opción 3: Usar IA para Generar Imágenes
Puedes usar herramientas como:
- **DALL-E**
- **Midjourney**
- **Stable Diffusion**

Para generar imágenes de productos Frito-Lay.

## 🔍 Verificación

Después de implementar las imágenes:

1. **Ejecuta la aplicación**
2. **Ve al catálogo** - deberías ver las nuevas imágenes
3. **Agrega productos al carrito** - las imágenes deben aparecer en el carrito
4. **Verifica en diferentes tamaños de pantalla**

## 🐛 Solución de Problemas

### Las imágenes no aparecen
- Verifica que los nombres de archivo coincidan exactamente
- Asegúrate de que las importaciones estén descomentadas
- Revisa que `useLocal` esté en `true`

### Error de importación
- Verifica que la ruta del archivo sea correcta
- Asegúrate de que el archivo existe en la ubicación especificada
- Revisa que el formato del archivo sea compatible (PNG/JPG)

### Imágenes de baja calidad
- Usa imágenes de al menos 400x400 píxeles
- Optimiza las imágenes para web (comprime sin perder mucha calidad)
- Usa herramientas como TinyPNG o ImageOptim

## 📞 Soporte

Si tienes problemas implementando las imágenes, puedes:
1. Verificar la consola de errores
2. Revisar que todos los archivos estén en la ubicación correcta
3. Asegurarte de que las importaciones estén correctas

¡Las imágenes harán que tu aplicación se vea mucho más profesional y atractiva! 🎉
