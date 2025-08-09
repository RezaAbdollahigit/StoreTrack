import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import type { Product} from '../types';
import { Home, XCircle } from 'lucide-react';

interface OrderItem {
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: number;
  customerName: string;
  totalAmount: string;
  status: 'Pending' | 'Sent' | 'Cancelled';
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/orders', {
          params: { search: searchTerm || undefined }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
      fetchOrders();
    }, 300);

    const intervalId = setInterval(fetchOrders, 10000); 

    return () => {
      clearTimeout(debounceTimeout);
      clearInterval(intervalId);
    };
  }, [searchTerm]);

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await apiClient.patch(`/orders/${orderId}/status`, { status: 'Cancelled' });
        alert('Order cancelled successfully.');
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      } catch (error) {
        console.error('Failed to cancel order', error);
        alert('Failed to cancel order.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Sent</span>;
      case 'Cancelled':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700">
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-10 gap-4 font-semibold text-left">
            <span className="col-span-1">Order ID</span>
            <span className="col-span-3">Customer</span>
            <span className="col-span-2">Order Date</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-2 text-right">Total Amount</span>
            <span className="col-span-1 text-center">Actions</span>
          </div>
        </div>
        <div>
          {loading ? <p className="p-4 text-center">Loading...</p> : (
            orders.map(order => (
              <div key={order.id} className="border-b">
                <div 
                  onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)} 
                  className="grid grid-cols-10 gap-4 p-4 text-left items-center hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-mono text-gray-700">#{order.id}</span>
                  <span className="col-span-3">{order.customerName}</span>
                  <span className="col-span-2">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="col-span-1">{getStatusBadge(order.status)}</span>
                  <span className="col-span-2 text-right font-mono">${Number(order.totalAmount).toLocaleString()}</span>
                  <div className="col-span-1 text-center">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }} 
                        className="text-red-500 hover:text-red-700" 
                        title="Cancel Order"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>
                {openOrderId === order.id && (
                  <div className="p-4 bg-gray-100">
                    <h4 className="font-bold mb-2">Order Details:</h4>
                    <ul className="space-y-2">
                      {order.items?.map((item: OrderItem) => (
                        <li key={item.product.id} className="flex justify-between w-full sm:w-72">
                          <span>{item.product.name} (x{item.quantity})</span>
                          <span>${(Number(item.product.price) * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}