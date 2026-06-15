import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/productsApi';

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // al cambiar filtro, resetear página
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  return { search, category, page, setFilter };
};

export const useProducts = () => {
  const { search, category, page } = useFilters();

  return useQuery({
    queryKey: ['products', { search, category, page }],
    queryFn: () => fetchProducts(page, search, category),
    placeholderData: (prev) => prev,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
};