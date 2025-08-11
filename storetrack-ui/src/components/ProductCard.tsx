import { useState } from 'react';
import { MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import type { Product } from '../types';
import { useAddToCart } from '../hooks/useAddToCart';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleAddToCart } = useAddToCart();
  const BACKEND_URL = 'http://localhost:3000';

  const fullImageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : 'https://via.placeholder.com/150';

  const isLowStock = product.stockQuantity < 10;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Menu Button (Top Right) */}
      <div className="absolute top-2 right-2 z-20">
        <button 
          type="button"
          onClick={() => setMenuOpen(!menuOpen)} 
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)} 
          className="p-1 bg-white/70 rounded-full hover:bg-gray-200"
          aria-label="Product options"
        >
          <MoreVertical size={20} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Edit size={16} className="mr-2" /> Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="w-full h-48 overflow-hidden bg-white">
        <img 
          src={fullImageUrl} 
          alt={product.name} 
          className="h-full w-full object-contain object-center"
        />
      </div>
      
      {/* Text content container */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>
        <div className="flex-grow" />
        {/* Price and Stock Container */}
        <div className="mt-2 flex justify-between items-center">
          <p className="text-gray-800 font-semibold">
            ${Number(product.price).toLocaleString()}
          </p>
          <div className="text-sm text-gray-500">
            {isLowStock ? (
              <span className="font-bold text-red-500">Low Stock: {product.stockQuantity}</span>
            ) : (
              <span>
                Stock: <span className="font-medium text-gray-700">{product.stockQuantity}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plus Button (Top Left) */}
      <div className="absolute top-2 left-2 z-10">
        <button
          type="button"
          onClick={() => handleAddToCart(product)}
          className="p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110"
          aria-label={`Add ${product.name} to order`}
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;