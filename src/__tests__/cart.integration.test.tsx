import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { ProductCard } from '../components/product/productcard';
import { CartDrawer } from '../components/cart/CartDrawer';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

// Producto mock
const mockProduct: Product = {
  id: 1,
  title: 'Producto Test',
  description: 'Descripción de prueba',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'Brand Test',
  category: 'test',
  thumbnail: 'https://via.placeholder.com/150',
  images: [],
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

describe('Flujo carrito — integración', () => {
  beforeEach(() => {
    // Limpiar store antes de cada test
    useCartStore.setState({ items: [] });
  });

  test('agregar producto al carrito actualiza el total correctamente', async () => {
    const addItem = useCartStore.getState().addItem;

    // Agregar producto
    act(() => {
      addItem(mockProduct);
    });

    const { getSubtotal, getTax, getTotal, items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(getSubtotal()).toBe(100);
    expect(getTax()).toBeCloseTo(19);
    expect(getTotal()).toBeCloseTo(119);
  });

  test('agregar el mismo producto incrementa la cantidad', () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(mockProduct);
      addItem(mockProduct);
    });

    const { items, getSubtotal } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(getSubtotal()).toBe(200);
  });

  test('el CartDrawer muestra el subtotal actualizado', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
    });

    render(
      <Wrapper>
        <CartDrawer isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getAllByText('$100.00')).toHaveLength(2); // aparece en item y subtotal
    expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
    expect(screen.getByText('$119.00')).toBeInTheDocument(); // total con IVA
  });

  test('botón agregar al carrito en ProductCard llama onAddToCart', () => {
    const onAddToCart = jest.fn();

    render(
      <Wrapper>
        <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Agregar al carrito'));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});