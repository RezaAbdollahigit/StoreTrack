import { useState, useEffect } from 'react';
import Modal from './Modal';
import AddProductForm from './AddProductForm';
import ProductCard from './ProductCard';
import apiClient from '../api/axios';
import { deleteCategory } from '../api/categories';
import type { Category, Product } from '../types';

interface CategorySectionProps {
  category: Category;
  onDeleteSuccess: (deletedCategoryId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onDataChange: () => void;
}

export default function CategorySection({
  category,
  onDeleteSuccess,
  onEditProduct,
  onDeleteProduct,
  onDataChange
}: CategorySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(`/products?categoryId=${category.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error(`Failed to fetch products for category ${category.id}`, error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category.id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the "${category.name}" category? This cannot be undone.`)) {
      try {
        await deleteCategory(category.id);
        onDeleteSuccess(category.id);
      } catch (error) {
        console.error('Failed to delete category', error);
        alert('Failed to delete category.');
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
              onClick={() => setIsModalOpen(true)}
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

        {/* --- PRODUCT LIST SECTION --- */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-nowrap items-start space-x-6 overflow-x-auto">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="w-70 flex-shrink-0">
                  <ProductCard
                    product={product}
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400">
                <p>No products in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Product to ${category.name}`}>
        <AddProductForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
            onDataChange();
          }}
          defaultCategoryId={category.id}
        />
      </Modal>
    </>
  );
}