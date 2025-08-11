import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import apiClient from '../api/axios';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import CategorySection from '../components/CategorySection';
import AddProductForm from '../components/AddProductForm';
import OrderSummary from '../components/OrderSummary';
import OrderReviewModal from '../components/OrderReviewModal';
import PriceFilterModal from '../components/PriceFilterModal';
import { PlusCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category, Product } from '../types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { logout } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isPriceModalOpen, setPriceModalOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min?: number, max?: number }>({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        apiClient.get('/categories'),
        // Pass all filter parameters to the products endpoint
        apiClient.get('/products', {
          params: {
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            search: searchTerm || undefined,
            categoryId: selectedCategory || undefined
          }
        })
      ]);
      const productsData: Product[] = productsRes.data;
      setCategories(categoriesRes.data);
      setAllProducts(productsData);

      const lowStockProducts = productsData.filter(
        (p) => p.stockQuantity > 0 && p.stockQuantity < 10
      );

      if (lowStockProducts.length > 0) {
        toast.dismiss('low-stock-toast'); // This is to prevent duplicates on fast re-renders
        toast.error((t) => (
          <div className="flex items-start justify-between w-full">
            <div className="text-sm">
              <p className="font-bold mb-2">Low Stock Warning!</p>
              <ul className="list-disc list-inside">
                {lowStockProducts.map(p => (
                  <li key={p.id}>
                    {p.name}: <span className="font-semibold">{p.stockQuantity} left</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 text-gray-500 hover:text-gray-800"
            >
              &#x2715;
            </button>
          </div>
        ), {
          id: 'low-stock-toast',
          duration: 6000,
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllData();
  }, [priceRange]);

  const filteredCategories = useMemo(() => {
    let filteredProducts = allProducts;
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(p =>
        p.categoryId === parseInt(selectedCategory)
      );
    }
    const grouped = filteredProducts.reduce((acc, product) => {
      const categoryId = product.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    }, {} as Record<number, Product[]>);

    return categories
      .map(cat => ({ ...cat, products: grouped[cat.id] || [] }))
      .filter(cat => cat.products.length > 0 || !selectedCategory);
  }, [searchTerm, selectedCategory, allProducts, categories]);

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        alert('Product deleted successfully.');
        fetchAllData();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handlePlaceOrder = async (customerName: string) => {
    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }
    const orderData = {
      customerName,
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
    };
    try {
      await apiClient.post('/orders', orderData);
      alert('Order placed successfully!');
      clearCart();
      setReviewModalOpen(false);
      await fetchAllData();
    } catch (error: any) {
      console.error('Failed to place order', error);
      alert(`Failed to place order: ${error.response?.data?.error || 'An unknown error occurred.'}`);
    }
  };

  const handleCategoryDeleted = (deletedCategoryId: number) => {
    setCategories(currentCategories =>
      currentCategories.filter(cat => cat.id !== deletedCategoryId)
    );
    // Also remove the products of the deleted category from the main product list
    setAllProducts(currentProducts =>
      currentProducts.filter(p => p.categoryId !== deletedCategoryId)
    );
  };

  const handleFormSuccess = () => {
    setProductModalOpen(false);
    setCategoryModalOpen(false);
    fetchAllData();
  };

  return (
    <>
      <div>
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-30 bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/stock-history" className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700">
                Stock History
              </Link>
              <Link to="/orders" className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700">
                <FileText size={20} />
                Orders List
              </Link>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <PlusCircle size={20} />
                Add Category
              </button>
              <button onClick={logout} className="px-4 py-2 font-medium rounded-md bg-red-500 text-white hover:bg-red-600">
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* --- PAGE CONTENT --- */}
        <div className="px-8 py-2 pb-32">
          <div className="flex gap-4 mb-6 p-4 bg-white rounded-lg shadow">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              onClick={() => setPriceModalOpen(true)}
              className="px-4 py-2 border rounded-md whitespace-nowrap bg-gray-200 hover:bg-gray-300"
            >
              Filter Price
            </button>
            <select
              aria-label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-md hover:bg-gray-300"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? <p className="text-center py-10">Loading...</p> : (
              <div>
                {filteredCategories.length === 0 ? (
                  <p className="text-center py-10">No results found.</p>
                ) : (
                  filteredCategories.map(category => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={category.products}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={handleDeleteProduct}
                      onDataChange={fetchAllData}
                      onDeleteSuccess={handleCategoryDeleted}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderSummary onReviewOrder={() => setReviewModalOpen(true)} />

      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add New Category">
        <AddCategoryForm onSuccess={handleFormSuccess} />
      </Modal>
      <Modal isOpen={isProductModalOpen} onClose={() => { setProductModalOpen(false); setProductToEdit(undefined); }} title={productToEdit ? "Edit Product" : "Add Product"}>
        <AddProductForm onSuccess={handleFormSuccess} productToEdit={productToEdit} />
      </Modal>
      <Modal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Review Your Order">
        <OrderReviewModal
          onClose={() => setReviewModalOpen(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      </Modal>
      <Modal isOpen={isPriceModalOpen} onClose={() => setPriceModalOpen(false)} title="Filter by Price Range">
        <PriceFilterModal
          onClose={() => setPriceModalOpen(false)}
          onApply={(range) => setPriceRange(range)}
        />
      </Modal>
    </>
  );
}