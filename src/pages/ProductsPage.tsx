import { useState, useCallback } from 'react';
import { useProducts, useFilters } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { Productgrid } from '../components/product/productgrid';
import { FilterBar } from '../components/product/FilterBar';
import { Toast, useToast } from '../components/ui/Toast';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import type { Product } from '../types';

const LIMIT = 12;

export const ProductsPage = () => {
  const { data, isLoading, isError, error } = useProducts();
  const { page, setFilter } = useFilters();
  const addItem = useCartStore(state => state.addItem);
  const { toast, showToast, hideToast } = useToast();

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
    showToast(`"${product.title}" agregado al carrito`);
  }, [addItem, showToast]);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl">❌</span>
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Catálogo de Productos</h1>
          {data && (
            <p className="text-sm text-gray-500">{data.total} productos encontrados</p>
          )}
        </div>

        <FilterBar />

        <Productgrid
          products={data?.products ?? []}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />

        {/* Paginación */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setFilter('page', String(page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Anterior
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilter('page', String(pageNum))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                      ${page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setFilter('page', String(page + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ErrorBoundary>
  );
};