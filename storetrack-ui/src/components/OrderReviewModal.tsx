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
    <div className="flex flex-col">
      <div className="space-y-4 mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b font-semibold">
          <div className="col-span-2">Product</div>
          <div>Quantity</div>
          <div className="text-right">Subtotal</div>
        </div>
        
        {/* Table Body */}
        {cartItems.map(item => (
          <div key={item.id} className="grid grid-cols-4 gap-4 items-center">
            <div className="col-span-2 font-medium">{item.name}</div>
            <div>x {item.quantity}</div>
            <div className="text-right">${(Number(item.price) * item.quantity).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t pt-4">
        <div className="flex justify-end items-center mb-4">
          <span className="text-lg">Total Cost:</span>
          <span className="text-xl font-bold ml-4">${totalAmount.toLocaleString()}</span>
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
    </div>
  );
}