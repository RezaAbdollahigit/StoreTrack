import { useState, useEffect } from 'react';
import Modal from './Modal';
import AddProductForm from './AddProductForm';
import ProductCard from './ProductCard'; 
import apiClient from '../api/axios';
import type { Category, Product } from '../types'; 

interface CategorySectionProps {
  category: Category;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;   
  onDataChange: () => void; 
}

export default function CategorySection({ category, onEditProduct, onDeleteProduct, onDataChange }: CategorySectionProps) {
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
  
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">No products in this category yet.</p>
          )}
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