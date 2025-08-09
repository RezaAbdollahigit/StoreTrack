import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export const useAddToCart = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    const quantityStr = window.prompt(`How many units of "${product.name}" would you like to add?`, '1');
    
    if (quantityStr === null) { // User cancelled the prompt
      return;
    }

    const quantity = parseInt(quantityStr, 10);

    // --- Validation ---
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    if (quantity > product.stockQuantity) {
      alert(`Error: Not enough stock. Only ${product.stockQuantity} units available.`);
      return;
    }

    addToCart(product, quantity); 
    alert(`${quantity} unit(s) of "${product.name}" added to the cart.`);
  };

  return { handleAddToCart };
};