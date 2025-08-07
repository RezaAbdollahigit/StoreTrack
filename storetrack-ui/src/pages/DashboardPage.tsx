import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // 1. Import useCart
import apiClient from '../api/axios';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import CategorySection from '../components/CategorySection';
import AddProductForm from '../components/AddProductForm'; 
import OrderSummary from '../components/OrderSummary';
import OrderReviewModal from '../components/OrderReviewModal'; // 2. Import the new modal
import { PlusCircle } from 'lucide-react';
import type { Category, Product } from '../types';

export default function DashboardPage() {
  const { logout } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

    const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchCategoriesAndProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);
  
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setProductModalOpen(true);
  };
  
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        alert('Product deleted successfully.');
        fetchCategoriesAndProducts(); 
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleCategoryDeleted = (deletedCategoryId: number) => {
    setCategories(currentCategories => 
      currentCategories.filter(cat => cat.id !== deletedCategoryId)
    );
  };

  const handlePlaceOrder = async () => {
    const customerName = window.prompt("Please enter the customer name for this order:");
    if (!customerName) {
      alert("Customer name is required to place an order.");
      return;
    }

    const orderData = {
      customerName,
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
    };

    try {
      await apiClient.post('/orders', orderData);
      alert('Order placed successfully!');
      clearCart(); // Clear the cart
      setReviewModalOpen(false); // Close the modal
      fetchCategoriesAndProducts(); // Refresh data to show updated stock
    } catch (error: any) {
      console.error('Failed to place order', error);
      alert(`Failed to place order: ${error.response?.data?.error || 'An unknown error occurred.'}`);
    }
  };

  const handleFormSuccess = () => {
    setProductModalOpen(false);
    setCategoryModalOpen(false);
    fetchCategoriesAndProducts(); 
  };

  return (
    <>
      {/* Added extra padding-bottom (pb-32) to the main container */}
      <div className="p-8 pb-32"> 
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setProductToEdit(undefined); setCategoryModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <PlusCircle size={20} />
              Add Category
            </button>
            <button onClick={logout} className="px-4 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600">
              Log Out
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? <p>Loading categories...</p> : (
            <div>
              {categories.length === 0 ? (
                <p>No categories found. Click "Add Category" to get started.</p>
              ) : (
                categories.map(category => (
                  <CategorySection 
                    key={category.id} 
                    category={category}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onDataChange={fetchCategoriesAndProducts}
                    onDeleteSuccess={handleCategoryDeleted}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* The OrderSummary component is placed here */}
      <OrderSummary onReviewOrder={() => setReviewModalOpen(true)} />

      {/* --- MODALS --- */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add New Category">
        <AddCategoryForm onSuccess={handleFormSuccess} />
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => { setProductModalOpen(false); setProductToEdit(undefined); }} title={productToEdit ? "Edit Product" : "Add Product"}>
        <AddProductForm onSuccess={handleFormSuccess} productToEdit={productToEdit} />
      </Modal>
      
      <Modal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Review Your Order">
        <OrderReviewModal 
          onClose={() => setReviewModalOpen(false)} 
          onPlaceOrder={handlePlaceOrder} 
        />
      </Modal>
    </>
  );
}