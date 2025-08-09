import { useState } from 'react';
import Modal from './Modal';
import AddProductForm from './AddProductForm';
import ProductCard from './ProductCard'; 
import type { Category, Product } from '../types';

interface CategorySectionProps {
  category: Category;
  products: Product[]; // محصولات را به عنوان پراپ دریافت می‌کند
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onDataChange: () => void;
}

export default function CategorySection({ category, products, onEditProduct, onDeleteProduct, onDataChange }: CategorySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-lg min-h-[150px]">
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
            <p className="text-gray-400 col-span-full text-center py-10">No products in this category yet.</p>
          )}
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