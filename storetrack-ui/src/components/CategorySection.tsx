interface Category {
  id: number;
  name: string;
}

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">
          Add Product
        </button>
      </div>
      {/* This is where the horizontal product list will go */}
      <div className="p-4 bg-gray-50 rounded-lg min-h-[150px] flex items-center justify-center">
        <p className="text-gray-400">Products for this category will appear here.</p>
      </div>
    </div>
  );
}