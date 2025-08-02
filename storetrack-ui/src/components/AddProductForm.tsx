import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import apiClient from '../api/axios';

// 1. Define the validation schema for a product
const ProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be a positive number.')),
  stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock must be a whole number.')),
  categoryId: z.preprocess((val) => Number(val), z.number().positive('You must select a category.')),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

interface Category {
  id: number;
  name: string;
}

interface AddProductFormProps {
  onSuccess: () => void;
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
  });

  // 2. Fetch categories when the form loads to populate the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  // 3. Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      await apiClient.post('/products', data);
      alert('Product created successfully!');
      onSuccess(); // Notify the parent component (DashboardPage)
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input {...register('name')} className={inputClass} />
        {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register('description')} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input type="number" {...register('price')} className={inputClass} />
        {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
        <input type="number" {...register('stockQuantity')} className={inputClass} />
        {errors.stockQuantity && <p className="mt-1 text-red-500 text-sm">{errors.stockQuantity.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select {...register('categoryId')} className={inputClass}>
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-red-500 text-sm">{errors.categoryId.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}