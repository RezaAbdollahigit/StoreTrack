import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../api/axios';

// Validation schema for the category name
const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface AddCategoryFormProps {
  onSuccess: () => void;
}

export default function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await apiClient.post('/categories', data);
      onSuccess(); // Notify parent that the category was added
    } catch (error) {
      console.error('Failed to create category', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <input {...register('name')} className={inputClass} autoFocus />
        {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  );
}