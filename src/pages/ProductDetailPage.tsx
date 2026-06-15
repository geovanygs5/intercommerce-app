import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Toast, useToast } from '../components/ui/Toast';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(Number(id));
  const addItem = useCartStore(state => state.addItem);
  const { toast, showToast, hideToast } = useToast();

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product);
    showToast(`"${product.title}" agregado al carrito`);
  }, [product, addItem, showToast]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="w-32 h-4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="w-full h-96" />
          <div className="space-y-4">
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-1/3 h-10" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl">❌</span>
        <p className="text-red-500">{(error as Error)?.message ?? 'Producto no encontrado'}</p>
        <Button onClick={() => navigate('/')}>Volver al catálogo</Button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline mb-6 flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Imagen */}
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              {product.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">· Stock: {product.stock}</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    -{product.discountPercentage.toFixed(0)}% OFF
                  </span>
                </>
              )}
            </div>

            <Button
              variant="primary"
              className="w-full py-3 text-base mt-2"
              onClick={handleAddToCart}
            >
              🛒 Agregar al carrito
            </Button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ErrorBoundary>
  );
};