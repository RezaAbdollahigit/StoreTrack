import { useCart } from '../context/CartContext';

interface OrderReviewModalProps {
  onPlaceOrder: () => void;
  onClose: () => void;
}

export default function OrderReviewModal({ onPlaceOrder, onClose }: OrderReviewModalProps) {
  const { cartItems } = useCart();

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

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
        <div className="flex justify-end items-center mb-6">
          <span className="text-lg">Total Cost:</span>
          <span className="text-xl font-bold ml-4">${totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPlaceOrder}
            className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Confirm & Place Order
          </button>
        </div>
      </div>
    </div>
  );
}