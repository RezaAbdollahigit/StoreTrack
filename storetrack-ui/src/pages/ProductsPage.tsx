import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import apiClient from '../api/axios';
import type { Product, Category } from '../types';
import Modal from '../components/Modal';
import AddProductForm from '../components/AddProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/products', {
        params: {
          search: searchTerm || undefined,
          categoryId: selectedCategory || undefined,
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, selectedCategory]);


  const handleAddClick = () => {
    setProductToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/products/${id}`);
        alert('Product deleted successfully.');
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={handleAddClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
        >
          <PlusCircle className="mr-2" size={20} />
          Add New Product
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.category?.name || 'N/A'}</td>
                  <td className="p-4">${Number(product.price).toLocaleString()}</td>
                  <td className="p-4">{product.stockQuantity}</td>
                  <td className="p-4 flex space-x-2">
                    <button onClick={() => handleEditClick(product)} className="text-blue-500 hover:text-blue-700"><Edit size={20} /></button>
                    <button onClick={() => handleDeleteClick(product.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={productToEdit ? 'Edit Product' : 'Add New Product'}>
        <AddProductForm onSuccess={handleFormSuccess} productToEdit={productToEdit} />
      </Modal>
    </div>
  );
};

export default ProductsPage;