interface Product {
  id: number;
  name: string;
  price: string;
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
    <div style={{
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      width: '200px'
    }}>
      <img 
        src={fullImageUrl} 
        alt={product.name} 
        style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
      />
      <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#555' }}>${Number(product.price).toLocaleString()}</p>
    </div>
  );
};

export default ProductCard;