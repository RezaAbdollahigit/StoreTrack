import { createContext, useState, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
  totalAmount: number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};