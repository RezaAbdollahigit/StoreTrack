import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import CategorySection from '../components/CategorySection';
import AddProductForm from '../components/AddProductForm'; 
import { PlusCircle } from 'lucide-react';
import type { Category, Product } from '../types';

export default function DashboardPage() {
  const { logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

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

  const handleFormSuccess = () => {
    setProductModalOpen(false);
    setCategoryModalOpen(false);
    fetchCategoriesAndProducts(); 
  };

  return (
    <>
      <div className="p-8">
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

      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add New Category">
        <AddCategoryForm onSuccess={handleFormSuccess} />
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setProductModalOpen(false)} title={productToEdit ? "Edit Product" : "Add Product"}>
        <AddProductForm onSuccess={handleFormSuccess} productToEdit={productToEdit} />
      </Modal>
    </>
  );
}