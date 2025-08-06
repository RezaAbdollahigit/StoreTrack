export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string;
  category?: Category; 
}