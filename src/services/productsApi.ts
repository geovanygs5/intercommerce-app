import type { Product, ProductsResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';
const LIMIT = 12;

export const fetchProducts = async (
  page: number = 1,
  search: string = '',
  category: string = ''
): Promise<ProductsResponse> => {
  const skip = (page - 1) * LIMIT;

  let url: string;

  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${LIMIT}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${LIMIT}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${LIMIT}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: no se pudo cargar los productos`);
  return res.json();
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}: producto no encontrado`);
  return res.json();
};

export const fetchCategories = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  const data = await res.json();
  // DummyJSON devuelve objetos {slug, name, url}, extraemos el slug
  return data.map((c: { slug: string }) => c.slug);
};