import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import apiClient from '../api/axios';
import type { Product } from '../types';

const ProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be a positive number.')),
  stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock must be a whole number.')),
  categoryId: z.preprocess((val) => Number(val), z.number().positive()), 
  image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

interface AddProductFormProps {
  onSuccess: () => void;
  productToEdit?: Product;
  defaultCategoryId?: number;
}

export default function AddProductForm({ onSuccess, productToEdit, defaultCategoryId }: AddProductFormProps) {
  const isEditMode = !!productToEdit;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ProductFormValues>();

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setValue('name', productToEdit.name);
      setValue('description', productToEdit.description);
      setValue('price', Number(productToEdit.price));
      setValue('stockQuantity', productToEdit.stockQuantity);
      setValue('categoryId', productToEdit.categoryId);
    } else if (defaultCategoryId) {
      setValue('categoryId', defaultCategoryId);
    }
  }, [productToEdit, defaultCategoryId, setValue, isEditMode]);

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'image' && data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        } else if (data[key as keyof ProductFormValues] !== undefined) {
            formData.append(key, String(data[key as keyof ProductFormValues]));
        }
    });

    try {
      if (isEditMode) {
        await apiClient.put(`/products/${productToEdit!.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully!');
      } else {
        await apiClient.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* All form fields */}
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
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <input type="file" {...register('image')} className={`${inputClass} p-1`} />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}
      </button>
    </form>
  );
}