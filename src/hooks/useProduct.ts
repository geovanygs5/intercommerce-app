import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../services/productsApi';

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};