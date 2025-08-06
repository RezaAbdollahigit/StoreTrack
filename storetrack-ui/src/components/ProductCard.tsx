import { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const BACKEND_URL = 'http://localhost:3000';

  const fullImageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : 'https://via.placeholder.com/150';

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg flex flex-col w-full">
      {/* Menu Button (Three Dots) */}
      <div className="absolute top-2 right-2 z-10">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="p-1 bg-white/70 rounded-full hover:bg-white"
          aria-label="Product options"
        >
          <MoreVertical size={20} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1">
            <button
              onClick={() => onEdit(product)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Edit size={16} className="mr-2" /> Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        <img
          src={fullImageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center" // Use object-cover here
        />
      </div>

      <div className="p-4 bg-white flex-grow flex flex-col min-w-0">
        <h3 className="text-lg font-semibold flex-grow">
          {product.name}
        </h3>
        <p className="text-gray-600 mt-2">${Number(product.price).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;