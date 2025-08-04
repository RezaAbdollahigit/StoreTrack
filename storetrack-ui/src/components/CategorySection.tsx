import { useState, useEffect } from 'react';
import Modal from './Modal';
import AddProductForm from './AddProductForm';
import ProductCard from './ProductCard'; 
import apiClient from '../api/axios'; 

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl?: string;
}

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
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
        <div className="p-4 bg-gray-50 rounded-lg min-h-[150px] flex items-center">
          {products.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No products in this category yet.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Product to ${category.name}`}>
        <AddProductForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts(); 
          }}
          defaultCategoryId={category.id}
        />
      </Modal>
    </>
  );
}