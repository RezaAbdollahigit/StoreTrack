import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import apiClient from '../api/axios';

// 1. Schema updated to include an optional image field
const ProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be a positive number.')),
  stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock must be a whole number.')),
  categoryId: z.preprocess((val) => Number(val), z.number().positive('You must select a category.')),
  image: z.any().optional(), // For the file input
});

type ProductFormValues = z.infer<typeof ProductSchema>;

interface Category {
  id: number;
  name: string;
}

interface AddProductFormProps {
  onSuccess: () => void;
  defaultCategoryId?: number;
}

export default function AddProductForm({ onSuccess, defaultCategoryId }: AddProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { categoryId: defaultCategoryId }
  });

  useEffect(() => {
    if (!defaultCategoryId) {
      const fetchCategories = async () => {
        try {
          const response = await apiClient.get('/categories');
          setCategories(response.data);
        } catch (error) {
          console.error('Failed to fetch categories', error);
        }
      };
      fetchCategories();
    }
  }, [defaultCategoryId]);

  // 2. onSubmit function updated to send FormData
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('stockQuantity', String(data.stockQuantity));
    formData.append('categoryId', String(data.categoryId));
    if (data.description) {
      formData.append('description', data.description);
    }
    // Append the file if it exists
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    try {
      await apiClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* ... other fields ... */}
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
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            $
          </span>
          <input 
            type="number" 
            {...register('price')} 
            className={`${inputClass} pl-7`} 
          />
        </div>
        {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
        <input type="number" {...register('stockQuantity')} className={inputClass} />
        {errors.stockQuantity && <p className="mt-1 text-red-500 text-sm">{errors.stockQuantity.message}</p>}
      </div>
      
      {/* 3. File input added to the form */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <input type="file" {...register('image')} className={`${inputClass} p-1`} />
        {errors.image && <p className="mt-1 text-red-500 text-sm">{errors.image.message as string}</p>}
      </div>

      {!defaultCategoryId && (
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
      )}
      
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