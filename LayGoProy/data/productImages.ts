/**
 * Sistema de imágenes para productos Frito-Lay
 * Maneja las imágenes locales y URLs de productos
 */

// Importaciones de imágenes locales (descomenta cuando tengas las imágenes)
// import laysClassic from '../assets/images/products/lays-classic-150g.png';
// import laysQueso from '../assets/images/products/lays-queso-150g.png';
// import laysCebolla from '../assets/images/products/lays-cebolla-150g.png';
// import laysBarbacoa from '../assets/images/products/lays-barbacoa-150g.png';
// import doritosNacho from '../assets/images/products/doritos-nacho-150g.png';
// import doritosCoolRanch from '../assets/images/products/doritos-cool-ranch-150g.png';
// import doritosFlamas from '../assets/images/products/doritos-flamas-150g.png';
// import cheetosQueso from '../assets/images/products/cheetos-queso-150g.png';
// import cheetosPuffs from '../assets/images/products/cheetos-puffs-150g.png';
// import rufflesQueso from '../assets/images/products/ruffles-queso-150g.png';
// import rufflesCrema from '../assets/images/products/ruffles-crema-150g.png';
// import fritosOriginal from '../assets/images/products/fritos-original-150g.png';
// import tostitosSalsaVerde from '../assets/images/products/tostitos-salsa-verde-150g.png';
// import sabritasAdobadas from '../assets/images/products/sabritas-adobadas-150g.png';
// import gatoradeNaranja from '../assets/images/products/gatorade-naranja-500ml.png';

// URLs de imágenes de alta calidad (temporales hasta que tengas las imágenes locales)
const PRODUCT_IMAGES = {
  // Lay's Perú
  'lays-clasico-150g': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center',
  'lays-queso-150g': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
  'lays-jamon-150g': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center',
  'lays-cebolla-150g': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
  'lays-barbacoa-edicion-limitada-150g': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',

  // Doritos Perú
  'doritos-nacho-cheese-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'doritos-cool-ranch-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'doritos-salsa-picante-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'doritos-fuego-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',

  // Cheetos Perú
  'cheetos-queso-clasico-150g': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
  'cheetos-flamin-hot-150g': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
  'cheetos-blanco-150g': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center',

  // Cheese Tris / Chizitos
  'cheese-tris-queso-150g': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center',
  'chizitos-queso-natural-150g': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center',
  'chizitos-picante-150g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',

  // Piqueo Snax
  'piqueo-snax-mix-clasico-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'piqueo-snax-picante-mixto-145g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',

  // Cuates
  'cuates-natural-150g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'cuates-picante-150g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
  'cuates-rancherito-150g': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=center',
};

// Mapeo de imágenes locales (descomenta cuando tengas las imágenes)
// const LOCAL_IMAGES = {
//   'lays-classic-150g': laysClassic,
//   'lays-queso-150g': laysQueso,
//   'lays-cebolla-150g': laysCebolla,
//   'lays-barbacoa-150g': laysBarbacoa,
//   'doritos-nacho-150g': doritosNacho,
//   'doritos-cool-ranch-150g': doritosCoolRanch,
//   'doritos-flamas-150g': doritosFlamas,
//   'cheetos-queso-150g': cheetosQueso,
//   'cheetos-puffs-150g': cheetosPuffs,
//   'ruffles-queso-150g': rufflesQueso,
//   'ruffles-crema-150g': rufflesCrema,
//   'fritos-original-150g': fritosOriginal,
//   'tostitos-salsa-verde-150g': tostitosSalsaVerde,
//   'sabritas-adobadas-150g': sabritasAdobadas,
//   'gatorade-naranja-500ml': gatoradeNaranja,
// };

/**
 * Obtiene la imagen de un producto por su ID
 * @param productId - ID del producto
 * @param useLocal - Si usar imágenes locales (true) o URLs (false)
 * @returns URI de la imagen
 */
export const getProductImage = (productId: string, useLocal: boolean = false): string => {
  // Si tienes imágenes locales, descomenta esta línea:
  // if (useLocal && LOCAL_IMAGES[productId as keyof typeof LOCAL_IMAGES]) {
  //   return LOCAL_IMAGES[productId as keyof typeof LOCAL_IMAGES];
  // }
  
  // Por ahora, siempre usa URLs
  return PRODUCT_IMAGES[productId as keyof typeof PRODUCT_IMAGES] || 
         'https://via.placeholder.com/400x400/E31E24/FFFFFF?text=Imagen+No+Disponible';
};

/**
 * Obtiene todas las imágenes de productos
 * @param useLocal - Si usar imágenes locales (true) o URLs (false)
 * @returns Objeto con todas las imágenes
 */
export const getAllProductImages = (useLocal: boolean = false): Record<string, string> => {
  const images: Record<string, string> = {};
  
  Object.keys(PRODUCT_IMAGES).forEach(productId => {
    images[productId] = getProductImage(productId, useLocal);
  });
  
  return images;
};

/**
 * Verifica si una imagen existe
 * @param productId - ID del producto
 * @returns true si la imagen existe
 */
export const hasProductImage = (productId: string): boolean => {
  return productId in PRODUCT_IMAGES;
};

/**
 * Obtiene una imagen de placeholder personalizada
 * @param productName - Nombre del producto
 * @param brand - Marca del producto
 * @returns URL de placeholder personalizada
 */
export const getPlaceholderImage = (productName: string, brand: string): string => {
  const encodedName = encodeURIComponent(`${brand} ${productName}`);
  return `https://via.placeholder.com/400x400/E31E24/FFFFFF?text=${encodedName}`;
};
