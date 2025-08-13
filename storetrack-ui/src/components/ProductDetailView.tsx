import type { Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const BACKEND_URL = 'http://localhost:3000';
  const fullImageUrl = product.imageUrl 
    ? `${BACKEND_URL}${product.imageUrl}` 
    : 'https://via.placeholder.com/256';

  return (
    <div className="flex flex-col gap-4">
      <img 
        src={fullImageUrl} 
        alt={product.name} 
        className="w-full h-64 object-contain rounded-lg bg-gray-100"
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{product.category?.name || 'No Category'}</p>
        <p className="text-base text-gray-700">{product.description || 'No description available.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Price</p>
          <p className="text-lg font-semibold">${Number(product.price).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className="text-lg font-semibold">{product.stockQuantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;