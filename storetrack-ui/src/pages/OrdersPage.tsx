import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import type { Product } from '../types';

interface OrderItem {
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: number;
  customerName: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center p-8">Loading orders...</p>;
  }

  return (
    <div>
      {/* --- Main Sticky Header --- */}
      <div className="sticky top-0 z-30 bg-white shadow p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Order History</h1>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* --- Page Content --- */}
      <div className="p-8">
        {orders.length === 0 ? (
          <p>No orders have been placed yet.</p>
        ) : (
          <div>
            {/* --- STICKY TABLE HEADER  --- */}
            <div className="sticky top-[72px] z-20 bg-gray-100 p-4 rounded-t-lg border-b">
              <div className="grid grid-cols-4 gap-4 font-bold text-gray-600">
                <span>Order #</span>
                <span>Customer Name</span>
                <span>Date</span>
                <span className="text-right">Total Amount</span>
              </div>
            </div>

            {/* --- THE LIST OF ORDERS --- */}
            <div className="space-y-2">
              {orders.map(order => (
                <div key={order.id} className="border rounded-b-lg">
                  <button 
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100"
                    onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                  >
                    <div className="grid grid-cols-4 gap-4 font-semibold">
                      <span>Order #{order.id}</span>
                      <span>{order.customerName}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-right">${Number(order.totalAmount).toLocaleString()}</span>
                    </div>
                  </button>
                  {openOrderId === order.id && (
                    <div className="p-4 border-t">
                      <h4 className="font-bold mb-2">Order Details:</h4>
                      <ul className="space-y-2">
                        {order.items.map(item => (
                          <li key={item.product.id} className="flex justify-between">
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span>${(Number(item.product.price) * item.quantity).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}