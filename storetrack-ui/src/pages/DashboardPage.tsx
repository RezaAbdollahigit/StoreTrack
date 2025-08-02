import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios'; 
import ProductCard from '../components/ProductCard';

// Define the shape of a single product object
interface Product {
  id: number;
  name: string;
  price: string;
  stockQuantity: number;
  imageUrl?: string;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // This hook runs once when the component is first rendered
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from your backend using the API client
        const response = await apiClient.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading, whether it succeeded or failed
      }
    };

    fetchProducts();
  }, []); // The empty array [] means this effect runs only once

  return (
    <div className="p-8">
      {/* This is the header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">StoreTrack Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* This is the section to display the products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Your Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">You have not added any products yet.</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}