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
  { id: 'papas', name: 'Papas Fritas', icon: '🍟' },
  { id: 'doritos', name: 'Doritos', icon: '🌽' },
  { id: 'cheetos', name: 'Cheetos', icon: '🧀' },
  { id: 'ruffles', name: 'Ruffles', icon: '🥔' },
  { id: 'fritos', name: 'Fritos', icon: '🌽' },
  { id: 'tostitos', name: 'Tostitos', icon: '🌽' },
  { id: 'sabritas', name: 'Sabritas', icon: '🥔' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
];

export const products: Product[] = [
  // Papas Fritas Lay's
  {
    id: 'lays-classic-150g',
    name: 'Lay\'s Clásicas',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'clasicas',
    price: 3.50,
    wholesalePrice: 2.80,
    image: getProductImage('lays-classic-150g'),
    description: 'Papas fritas clásicas con sal, crujientes y deliciosas',
    weight: '150g',
    unit: 'bolsa',
    stock: 500,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['clasicas', 'sal', 'crujientes'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 170,
      carbs: 15
    }
  },
  {
    id: 'lays-queso-150g',
    name: 'Lay\'s Queso',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'sabores',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('lays-queso-150g'),
    description: 'Papas fritas con sabor a queso cheddar',
    weight: '150g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'cheddar', 'sabores'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 180,
      carbs: 15
    }
  },
  {
    id: 'lays-cebolla-150g',
    name: 'Lay\'s Cebolla',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'sabores',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('lays-cebolla-150g'),
    description: 'Papas fritas con sabor a cebolla y crema agria',
    weight: '150g',
    unit: 'bolsa',
    stock: 250,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['cebolla', 'crema', 'sabores'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 180,
      carbs: 15
    }
  },
  {
    id: 'lays-barbacoa-150g',
    name: 'Lay\'s Barbacoa',
    brand: 'Lay\'s',
    category: 'papas',
    subcategory: 'sabores',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('lays-barbacoa-150g'),
    description: 'Papas fritas con sabor a barbacoa ahumada',
    weight: '150g',
    unit: 'bolsa',
    stock: 200,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['barbacoa', 'ahumada', 'sabores'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 190,
      carbs: 15
    }
  },

  // Doritos
  {
    id: 'doritos-nacho-150g',
    name: 'Doritos Nacho Cheese',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'nacho',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('doritos-nacho-150g'),
    description: 'Tortillas de maíz con sabor a queso nacho',
    weight: '150g',
    unit: 'bolsa',
    stock: 400,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['nacho', 'queso', 'tortilla'],
    nutritionalInfo: {
      calories: 150,
      fat: 8,
      sodium: 200,
      carbs: 18
    }
  },
  {
    id: 'doritos-cool-ranch-150g',
    name: 'Doritos Cool Ranch',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'ranch',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('doritos-cool-ranch-150g'),
    description: 'Tortillas de maíz con sabor a ranch fresco',
    weight: '150g',
    unit: 'bolsa',
    stock: 350,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['ranch', 'fresco', 'tortilla'],
    nutritionalInfo: {
      calories: 150,
      fat: 8,
      sodium: 200,
      carbs: 18
    }
  },
  {
    id: 'doritos-flamas-150g',
    name: 'Doritos Flamas',
    brand: 'Doritos',
    category: 'doritos',
    subcategory: 'picante',
    price: 4.20,
    wholesalePrice: 3.30,
    image: getProductImage('doritos-flamas-150g'),
    description: 'Tortillas de maíz con sabor picante y limón',
    weight: '150g',
    unit: 'bolsa',
    stock: 300,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['picante', 'limon', 'tortilla'],
    nutritionalInfo: {
      calories: 150,
      fat: 8,
      sodium: 220,
      carbs: 18
    }
  },

  // Cheetos
  {
    id: 'cheetos-queso-150g',
    name: 'Cheetos Queso',
    brand: 'Cheetos',
    category: 'cheetos',
    subcategory: 'queso',
    price: 4.00,
    wholesalePrice: 3.20,
    image: getProductImage('cheetos-queso-150g'),
    description: 'Snacks de maíz inflado con sabor a queso cheddar',
    weight: '150g',
    unit: 'bolsa',
    stock: 450,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'cheddar', 'inflado'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 250,
      carbs: 15
    }
  },
  {
    id: 'cheetos-puffs-150g',
    name: 'Cheetos Puffs',
    brand: 'Cheetos',
    category: 'cheetos',
    subcategory: 'puffs',
    price: 4.00,
    wholesalePrice: 3.20,
    image: getProductImage('cheetos-puffs-150g'),
    description: 'Snacks de maíz inflado esponjoso con sabor a queso',
    weight: '150g',
    unit: 'bolsa',
    stock: 380,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'puffs', 'esponjoso'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 250,
      carbs: 15
    }
  },

  // Ruffles
  {
    id: 'ruffles-queso-150g',
    name: 'Ruffles Queso',
    brand: 'Ruffles',
    category: 'ruffles',
    subcategory: 'queso',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('ruffles-queso-150g'),
    description: 'Papas fritas onduladas con sabor a queso',
    weight: '150g',
    unit: 'bolsa',
    stock: 320,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['queso', 'onduladas', 'crujientes'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 200,
      carbs: 15
    }
  },
  {
    id: 'ruffles-crema-150g',
    name: 'Ruffles Crema y Cebolla',
    brand: 'Ruffles',
    category: 'ruffles',
    subcategory: 'crema',
    price: 4.50,
    wholesalePrice: 3.60,
    image: getProductImage('ruffles-crema-150g'),
    description: 'Papas fritas onduladas con sabor a crema y cebolla',
    weight: '150g',
    unit: 'bolsa',
    stock: 280,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['crema', 'cebolla', 'onduladas'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 200,
      carbs: 15
    }
  },

  // Fritos
  {
    id: 'fritos-original-150g',
    name: 'Fritos Original',
    brand: 'Fritos',
    category: 'fritos',
    subcategory: 'original',
    price: 3.80,
    wholesalePrice: 3.00,
    image: getProductImage('fritos-original-150g'),
    description: 'Tortillas de maíz fritas con sal, sabor original',
    weight: '150g',
    unit: 'bolsa',
    stock: 200,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['original', 'sal', 'tortilla'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 170,
      carbs: 15
    }
  },

  // Tostitos
  {
    id: 'tostitos-salsa-verde-150g',
    name: 'Tostitos Salsa Verde',
    brand: 'Tostitos',
    category: 'tostitos',
    subcategory: 'salsa',
    price: 4.00,
    wholesalePrice: 3.20,
    image: getProductImage('tostitos-salsa-verde-150g'),
    description: 'Tortillas de maíz con sabor a salsa verde',
    weight: '150g',
    unit: 'bolsa',
    stock: 150,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['salsa', 'verde', 'tortilla'],
    nutritionalInfo: {
      calories: 150,
      fat: 8,
      sodium: 180,
      carbs: 18
    }
  },

  // Sabritas
  {
    id: 'sabritas-adobadas-150g',
    name: 'Sabritas Adobadas',
    brand: 'Sabritas',
    category: 'sabritas',
    subcategory: 'adobadas',
    price: 3.50,
    wholesalePrice: 2.80,
    image: getProductImage('sabritas-adobadas-150g'),
    description: 'Papas fritas con sabor adobado tradicional',
    weight: '150g',
    unit: 'bolsa',
    stock: 180,
    minOrderQuantity: 12,
    maxOrderQuantity: 100,
    isAvailable: true,
    isWholesale: true,
    tags: ['adobadas', 'tradicional', 'picante'],
    nutritionalInfo: {
      calories: 160,
      fat: 10,
      sodium: 200,
      carbs: 15
    }
  },

  // Bebidas
  {
    id: 'gatorade-naranja-500ml',
    name: 'Gatorade Naranja',
    brand: 'Gatorade',
    category: 'bebidas',
    subcategory: 'deportiva',
    price: 2.50,
    wholesalePrice: 2.00,
    image: getProductImage('gatorade-naranja-500ml'),
    description: 'Bebida deportiva sabor naranja, 500ml',
    weight: '500ml',
    unit: 'botella',
    stock: 100,
    minOrderQuantity: 24,
    maxOrderQuantity: 200,
    isAvailable: true,
    isWholesale: true,
    tags: ['deportiva', 'naranja', 'hidratacion'],
    nutritionalInfo: {
      calories: 80,
      fat: 0,
      sodium: 110,
      carbs: 21
    }
  }
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
