import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function OrderSummary() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Conditional styling based on whether the cart has items
  const isEmpty = itemCount === 0;
  const containerClasses = isEmpty
    ? 'bg-gray-100 border-gray-300 text-gray-400'
    : 'bg-indigo-600 border-indigo-700 text-white shadow-lg';

  return (
    <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-4 border-t rounded-t-lg transition-all duration-300 ${containerClasses}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} />
          <h3 className="font-bold text-lg">
            {isEmpty ? 'Order Summary' : `${itemCount} Items in Cart`}
          </h3>
        </div>
        <button 
          disabled={isEmpty}
          className="px-6 py-2 font-semibold rounded-md bg-white text-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}