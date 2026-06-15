import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
      hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div
        className="cursor-pointer overflow-hidden"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </span>

        <h3
          className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => onAddToCart(product)}
          >
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';