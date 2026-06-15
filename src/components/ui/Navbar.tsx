import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

interface NavbarProps {
  onCartOpen: () => void;
}

export const Navbar = ({ onCartOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const totalItems = useCartStore(state => state.getTotalItems());

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span
            onClick={() => navigate('/')}
            className="text-xl font-bold text-blue-600 cursor-pointer"
          >
            InterCommerce
          </span>

          <button
            onClick={onCartOpen}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs
                rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};