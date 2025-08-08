import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface OrderReviewModalProps {
  onClose: () => void;
  onPlaceOrder: (customerName: string) => void;
}

export default function OrderReviewModal({ onClose, onPlaceOrder }: OrderReviewModalProps) {
  const { cartItems, totalAmount } = useCart();
  const [customerName, setCustomerName] = useState('');

  const handlePlaceOrderClick = () => {
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }
    onPlaceOrder(customerName);
  };

  return (
    <div>
      <ul className="space-y-2 mb-4">
        {cartItems.map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="border-t pt-2 mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="customerName" className="block text-sm font-medium mb-1">
          Customer Name
        </label>
        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter customer name"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePlaceOrderClick}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}