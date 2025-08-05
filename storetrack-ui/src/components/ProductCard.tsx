interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  stockQuantity?: number;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const BACKEND_URL = 'http://localhost:3000';
  
  const fullImageUrl = product.imageUrl 
    ? `${BACKEND_URL}${product.imageUrl}` 
    : 'https://via.placeholder.com/150';

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg flex flex-col w-full">
      <img 
        src={fullImageUrl} 
        alt={product.name} 
        className="w-full h-56 object-cover"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white p-4
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm text-center mb-2">{product.description || 'No description available.'}</p>
        <p className="font-bold">Stock: {product.stockQuantity ?? 'N/A'}</p>
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