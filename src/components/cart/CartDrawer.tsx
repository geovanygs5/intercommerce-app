import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <img
        src={item.product.thumbnail}
        alt={item.product.title}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
          {item.product.title}
        </p>
        <p className="text-sm font-bold text-blue-600 mb-2">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-gray-200 text-gray-600
              hover:bg-gray-100 flex items-center justify-center text-sm"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-gray-200 text-gray-600
              hover:bg-gray-100 flex items-center justify-center text-sm"
          >
            +
          </button>
          <button
            onClick={() => removeItem(item.product.id)}
            className="ml-auto text-xs text-red-400 hover:text-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
        transform transition-transform duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Carrito ({items.length} productos)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <span className="text-5xl">🛒</span>
              <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <CartItemRow key={item.product.id} item={item} />
            ))
          )}
        </div>

        {/* Footer con totales */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>IVA (19%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2
                border-t border-gray-200">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button variant="primary" className="w-full mb-2">
              Finalizar compra
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </div>
        )}
      </div>
    </>
  );
};