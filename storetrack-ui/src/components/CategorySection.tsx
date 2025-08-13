import { useState } from 'react';
import Modal from './Modal';
import AddProductForm from './AddProductForm';
import ProductCard from './ProductCard'; 
import apiClient from '../api/axios'; 
import toast from 'react-hot-toast';  
import type { Category, Product } from '../types';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onDataChange: () => void;
  onDeleteSuccess: (deletedCategoryId: number) => void;
  onViewProduct: (product: Product) => void; 
}

export default function CategorySection({ 
  category, 
  products, 
  onEditProduct, 
  onDeleteProduct, 
  onDataChange,
  onDeleteSuccess,
  onViewProduct
}: CategorySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
      try {
        await apiClient.delete(`/categories/${category.id}`);
        toast.success('Category deleted successfully.');
        onDeleteSuccess(category.id);
      } catch (error) {
        console.error('Failed to delete category', error);
        toast.error('Failed to delete category.');
      }
    }
  };
 
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <div className="flex items-center gap-4"> 
            <button
              onClick={() => { setIsModalOpen(true); }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Product
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg">
          <div className="flex space-x-6 overflow-x-auto p-4">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="w-64 flex-shrink-0">
                  <ProductCard 
                    product={product} 
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                    onView={onViewProduct} 
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-10">
                <p>No products in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Product to ${category.name}`}>
        <AddProductForm
          onSuccess={() => {
            setIsModalOpen(false);
            onDataChange();
          }}
          defaultCategoryId={category.id}
        />
      </Modal>
    </>
  );
}