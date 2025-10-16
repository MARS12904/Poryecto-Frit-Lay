/**
 * Catálogo de productos Frito-Lay Perú
 * Datos realistas para comerciantes minoristas
 */

import { getProductImage } from './productImages';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  wholesalePrice: number; // Precio especial para comerciantes
  image: string;
  description: string;
  weight: string;
  unit: string;
  stock: number;
  minOrderQuantity: number; // Cantidad mínima de pedido
  maxOrderQuantity: number; // Cantidad máxima por pedido
  isAvailable: boolean;
  isWholesale: boolean; // Disponible para venta al por mayor
  tags: string[];
  nutritionalInfo?: {
    calories: number;
    fat: number;
    sodium: number;
    carbs: number;
  };
  promotion?: {
    type: 'discount' | 'bulk' | 'seasonal';
    value: number;
    description: string;
    validUntil?: string;
  };
}

export const productCategories = [
  { id: 'papas', name: 'Lay\'s (Papas)', icon: '🥔' },
  { id: 'doritos', name: 'Doritos', icon: '🌽' },
  { id: 'cheetos', name: 'Cheetos', icon: '🧀' },
  { id: 'cheese-tris', name: 'Cheese Tris', icon: '🧀' },
  { id: 'chizitos', name: 'Chizitos', icon: '🧀' },
  { id: 'piqueo', name: 'Piqueo Snax', icon: '🥨' },
  { id: 'cuates', name: 'Cuates', icon: '🌽' },
];

export const products: Product[] = [
  // Lay's Perú
  {
    id: 'lays-clasico-150g',
    name: 'Lay\'s Clásico',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'clasico',
    price: 4.00,
    wholesalePrice: 3.20,
    image: getProductImage('lays-clasico-150g'),
    description: 'Papas fritas clásicas con sal. Crocantes y deliciosas.',
    weight: '150g',
    unit: 'bolsa',
    stock: 500,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['clasico', 'sal', 'papas']
  },
  {
    id: 'lays-queso-150g',
    name: 'Lay\'s Queso',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'queso',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('lays-queso-150g'),
    description: 'Papas fritas con sabor a queso.',
    weight: '150g',
    unit: 'bolsa',
    stock: 400,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'papas']
  },
  {
    id: 'lays-jamon-150g',
    name: 'Lay\'s Jamón',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'jamon',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('lays-jamon-150g'),
    description: 'Papas fritas con sabor a jamón.',
    weight: '150g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['jamon', 'papas']
  },
  {
    id: 'lays-cebolla-150g',
    name: 'Lay\'s Cebolla',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'cebolla',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('lays-cebolla-150g'),
    description: 'Papas fritas con sabor a cebolla.',
    weight: '150g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['cebolla', 'papas']
  },
  {
    id: 'lays-barbacoa-edicion-limitada-150g',
    name: 'Lay\'s Barbacoa (edición limitada)',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'barbacoa',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('lays-barbacoa-edicion-limitada-150g'),
    description: 'Papas fritas sabor barbacoa en edición limitada.',
    weight: '150g',
    unit: 'bolsa',
    stock: 200,
    minOrderQuantity: 12,
    maxOrderQuantity: 60,
    isAvailable: true,
    isWholesale: true,
    tags: ['barbacoa', 'edicion-limitada', 'papas']
  },

  // Doritos Perú
  {
    id: 'doritos-nacho-cheese-145g',
    name: 'Doritos Nacho Cheese',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'nacho',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('doritos-nacho-cheese-145g'),
    description: 'Tortillas de maíz sabor queso nacho.',
    weight: '145g',
    unit: 'bolsa',
    stock: 450,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['nacho', 'tortilla']
  },
  {
    id: 'doritos-cool-ranch-145g',
    name: 'Doritos Cool Ranch',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'ranch',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('doritos-cool-ranch-145g'),
    description: 'Tortillas de maíz sabor ranch.',
    weight: '145g',
    unit: 'bolsa',
    stock: 380,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['ranch', 'tortilla']
  },
  {
    id: 'doritos-salsa-picante-145g',
    name: 'Doritos Salsa Picante',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'picante',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('doritos-salsa-picante-145g'),
    description: 'Tortillas de maíz con salsa picante.',
    weight: '145g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['picante', 'tortilla']
  },
  {
    id: 'doritos-fuego-145g',
    name: 'Doritos Fuego',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'fuego',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('doritos-fuego-145g'),
    description: 'Tortillas de maíz sabor extra picante.',
    weight: '145g',
    unit: 'bolsa',
    stock: 320,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['fuego', 'picante', 'tortilla']
  },

  // Cheetos Perú
  {
    id: 'cheetos-queso-clasico-150g',
    name: 'Cheetos Queso Clásico',
    brand: 'Cheetos',
    category: 'cheetos',
    subcategory: 'queso',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('cheetos-queso-clasico-150g'),
    description: 'Snacks de maíz inflado sabor queso clásico.',
    weight: '150g',
    unit: 'bolsa',
    stock: 420,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'maiz']
  },
  {
    id: 'cheetos-flamin-hot-150g',
    name: 'Cheetos Flamin\' Hot',
    brand: 'Cheetos',
    category: 'cheetos',
    subcategory: 'picante',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('cheetos-flamin-hot-150g'),
    description: 'Snacks de maíz inflado extra picantes.',
    weight: '150g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['flamin-hot', 'picante']
  },
  {
    id: 'cheetos-blanco-150g',
    name: 'Cheetos Blanco',
    brand: 'Cheetos',
    category: 'cheetos',
    subcategory: 'blanco',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('cheetos-blanco-150g'),
    description: 'Variante Cheetos Blanco.',
    weight: '150g',
    unit: 'bolsa',
    stock: 220,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['blanco', 'maiz']
  },

  // Cheese Tris (marca local)
  {
    id: 'cheese-tris-queso-150g',
    name: 'Cheese Tris Queso',
    brand: 'Cheese Tris',
    category: 'cheese-tris',
    subcategory: 'queso',
    price: 4.00,
    wholesalePrice: 3.10,
    image: getProductImage('cheese-tris-queso-150g'),
    description: 'Snacks de maíz sabor queso, versión local.',
    weight: '150g',
    unit: 'bolsa',
    stock: 350,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'local']
  },

  // Chizitos (marca local)
  {
    id: 'chizitos-queso-natural-150g',
    name: 'Chizitos Queso Natural',
    brand: 'Chizitos',
    category: 'chizitos',
    subcategory: 'queso',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('chizitos-queso-natural-150g'),
    description: 'Snacks de maíz sabor queso natural.',
    weight: '150g',
    unit: 'bolsa',
    stock: 260,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'maiz']
  },
  {
    id: 'chizitos-picante-150g',
    name: 'Chizitos Picante',
    brand: 'Chizitos',
    category: 'chizitos',
    subcategory: 'picante',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('chizitos-picante-150g'),
    description: 'Snacks de maíz sabor picante.',
    weight: '150g',
    unit: 'bolsa',
    stock: 220,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['picante', 'maiz']
  },

  // Piqueo Snax
  {
    id: 'piqueo-snax-mix-clasico-145g',
    name: 'Piqueo Snax Mix Clásico',
    brand: 'Piqueo Snax',
    category: 'piqueo',
    subcategory: 'clasico',
    price: 5.00,
    wholesalePrice: 4.00,
    image: getProductImage('piqueo-snax-mix-clasico-145g'),
    description: 'Mix clásico de snacks.',
    weight: '145g',
    unit: 'bolsa',
    stock: 240,
    minOrderQuantity: 12,
    maxOrderQuantity: 96,
    isAvailable: true,
    isWholesale: true,
    tags: ['mix', 'clasico']
  },
  {
    id: 'piqueo-snax-picante-mixto-145g',
    name: 'Piqueo Snax Picante Mixto',
    brand: 'Piqueo Snax',
    category: 'piqueo',
    subcategory: 'picante',
    price: 5.00,
    wholesalePrice: 4.00,
    image: getProductImage('piqueo-snax-picante-mixto-145g'),
    description: 'Mix picante de snacks.',
    weight: '145g',
    unit: 'bolsa',
    stock: 200,
    minOrderQuantity: 12,
    maxOrderQuantity: 96,
    isAvailable: true,
    isWholesale: true,
    tags: ['picante', 'mix']
  },

  // Cuates (tortillas)
  {
    id: 'cuates-natural-150g',
    name: 'Cuates Natural',
    brand: 'Cuates',
    category: 'cuates',
    subcategory: 'natural',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('cuates-natural-150g'),
    description: 'Tortillas de maíz sabor natural.',
    weight: '150g',
    unit: 'bolsa',
    stock: 260,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['tortilla', 'natural']
  },
  {
    id: 'cuates-picante-150g',
    name: 'Cuates Picante',
    brand: 'Cuates',
    category: 'cuates',
    subcategory: 'picante',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('cuates-picante-150g'),
    description: 'Tortillas de maíz sabor picante.',
    weight: '150g',
    unit: 'bolsa',
    stock: 240,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['tortilla', 'picante']
  },
  {
    id: 'cuates-rancherito-150g',
    name: 'Cuates Rancherito',
    brand: 'Cuates',
    category: 'cuates',
    subcategory: 'rancherito',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('cuates-rancherito-150g'),
    description: 'Tortillas de maíz sabor rancherito.',
    weight: '150g',
    unit: 'bolsa',
    stock: 220,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    isAvailable: true,
    isWholesale: true,
    tags: ['tortilla', 'rancherito']
  },
];

// Funciones de utilidad para el catálogo
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getAvailableProducts = (): Product[] => {
  return products.filter(product => product.isAvailable && product.stock > 0);
};

export const getWholesaleProducts = (): Product[] => {
  return products.filter(product => product.isWholesale && product.isAvailable);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
