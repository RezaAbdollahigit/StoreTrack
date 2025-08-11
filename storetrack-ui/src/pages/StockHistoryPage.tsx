import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { Home, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { Product } from '../types';

interface StockMovement {
  id: number;
  quantityChange: number;
  reason: string;
  createdAt: string;
  product: Product;
}

export default function StockHistoryPage() {
  const [history, setHistory] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/stock/history');
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching stock history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Function to format the date and time properly
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock History</h1>
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700">
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Change</th>
              <th className="p-4 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading history...</td></tr>
            ) : (
              history.map(entry => (
                <tr key={entry.id} className="border-b">
                  <td className="p-4 whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                  <td className="p-4 font-medium">{entry.product.name}</td>
                  <td className={`p-4 font-bold flex items-center gap-2 ${entry.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.quantityChange > 0 ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange}
                  </td>
                  <td className="p-4 text-gray-600">{entry.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}