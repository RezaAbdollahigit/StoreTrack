import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import CategorySection from '../components/CategorySection';
import { PlusCircle } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This function will now fetch categories
  const fetchCategories = async () => {
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
    fetchCategories();
  }, []);

  const handleAddCategorySuccess = () => {
    setIsModalOpen(false); // Close the modal
    fetchCategories(); // Refresh the category list
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
      >
        <AddCategoryForm onSuccess={handleAddCategorySuccess} />
      </Modal>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4"> {}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle size={20} />
              Add Category
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <div>
              {categories.length === 0 ? (
                <p className="text-center text-gray-500">No categories found. Click "Add Category" to get started.</p>
              ) : (
                categories.map(category => (
                  <CategorySection key={category.id} category={category} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}