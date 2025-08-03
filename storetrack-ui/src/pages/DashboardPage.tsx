import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal'; 
import AddProductForm from '../components/AddProductForm'; 
import { PlusCircle } from 'lucide-react'; // For the button icon

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  // Wrap fetchProducts in a function so we can call it again
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProductSuccess = () => {
    setIsModalOpen(false); // Close the modal
    fetchProducts(); // Refresh the product list
  };

  return (
    <>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Product"
      >
        <AddProductForm onSuccess={handleAddProductSuccess} />
      </Modal>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">StoreTrack Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Products</h2>
            <button
              onClick={() => setIsModalOpen(true)} // This button opens the modal
              className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle size={20} />
              Add Product
            </button>
          </div>
          {/* ... (rest of the product display logic is the same) */}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <p>You have not added any products yet.</p>
              ) : (
                products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}