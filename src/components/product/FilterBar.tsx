import { useCallback } from 'react';
import { useFilters } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useProducts';

export const FilterBar = () => {
  const { search, category, setFilter } = useFilters();
  const { data: categories = [] } = useCategories();

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('search', e.target.value);
  }, [setFilter]);

  const handleCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('category', e.target.value);
  }, [setFilter]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={handleSearch}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <select
        value={category}
        onChange={handleCategory}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
      >
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat.replace(/-/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
};