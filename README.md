# InterCommerce Web App

E-commerce SPA desarrollada como prueba técnica senior. Implementa catálogo con infinite scroll, filtros persistentes en URL, carrito con localStorage y caché optimizada con TanStack Query.

## Demo en vivo
[https://intercommerce-app.vercel.app](https://intercommerce-app.vercel.app)

## Repositorio
https://github.com/geovanygs5/intercommerce-app

## Arquitectura

src/
├── types/          # Interfaces compartidas (evita duplicación)
├── services/       # Solo fetch, sin lógica de negocio
├── hooks/          # Lógica de negocio + TanStack Query
├── store/          # Zustand (carrito + persistencia)
├── components/     # UI pura, reciben props y llaman callbacks
└── pages/          # Composición de hooks + componentes
Separación estricta de capas. Los componentes de UI no saben nada de APIs, localStorage o lógica de negocio. Esto permite testear cada capa de forma aislada y reemplazar implementaciones (ej: cambiar de REST a GraphQL sin tocar la UI).

### Decisiones técnicas

1. TanStack Query en lugar de useEffect manual
Configuracion de staleTime: 5 minutos para que el usuario no vea "refrescos" al volver al catálogo

Implementacion de retry: 1 en lugar del valor por defecto (3 reintentos) porque la API de DummyJSON es confiable y reintentar más veces solo empeora la UX

Uso de useInfiniteQuery para el scroll infinito, que maneja automáticamente la paginación y el estado de carga

2. Zustand sobre Redux Toolkit
Redux habría sido overkill para un solo slice de carrito

El middleware persist de Zustand me permitió implementar localStorage en 3 líneas vs ~20 con Redux

Los cálculos de totales los moví dentro del store (no en componentes) usando selectores memorizados

3. Filtros sincronizados con URL
Se evita usar useState simple porque al recargar la página se perdían los filtros

Se implementa useUrlFilters que lee window.location.search al inicio y actualiza el historial con pushState

El hook escucha el evento popstate para cuando el usuario usa botones "atrás/adelante"

Esto permite compartir enlaces como: /?q=iphone&category=smartphones

4. Infinite scroll vs paginación tradicional
Se opta por infinite scroll porque el catálogo es la vista principal con el fin de minimizar clics

Implementación de un listener de scroll con debounce implícito (500px del final)

TanStack Query maneja automáticamente la deduplicación de peticiones mientras carga la siguiente página

5. React.memo solo donde importa
Apliqué React.memo únicamente en ProductCard porque es un componente que se renderiza N veces en el grid

No se aplica en otros componentes porque no hay evidencia de renders innecesarios (usé React DevTools Profiler para verificar)

Los componentes como Button o Skeleton son muy livianos y memoizarlos añadiría complejidad sin beneficio



## Instalación local
# Clonar
git clone https://github.com/geovanygs5/intercommerce-app.git
cd intercommerce-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview

# Ejecutar tests una vez
npm test

# Modo watch (para desarrollo)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage

El archivo AddToCartFlow.test.tsx verifica que:

Al hacer clic en "Agregar al carrito" desde la página de detalle

El badge del carrito se actualice (muestre +1)

Al abrir el drawer, el producto aparezca en la lista

El total calculado coincida con el precio × cantidad

No se testea el fetch real (eso sería E2E), sino que se mockea la API y se verifica que el flujo de datos funciona.


# Pregrntas de profundidad tecnica

### 1. Hydration/Caché en Next.js (SSR)

1. Hydration/Caché en Next.js (SSR)
En Next.js usaría getServerSideProps o React Server Components para pre-fetching. Con TanStack Query se usa dehydrate/HydrationBoundary — el servidor serializa el caché y el cliente lo rehidrata sin refetch innecesario:

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchProducts } from '@/services/products'

export default async function ProductsPage() {
  const queryClient = new QueryClient()
  
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient />
    </HydrationBoundary>
  )
}

2. Seguridad XSS
Nunca usaría dangerouslySetInnerHTML directamente. Sanitizaría con DOMPurify antes de renderizar cualquier HTML de la API:

import DOMPurify from 'dompurify';

const safeHTML = DOMPurify.sanitize(product.description);
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />

3. Escalabilidad del carrito multi-tienda
Refactorizaría el store para soportar múltiples instancias usando un factory pattern con Zustand:

const createCartStore = (storeId: string) => create(
  persist(
    (set, get) => ({ ...cartLogic }),
    { name: `cart-${storeId}` }
  )
);

// Una instancia por tienda
const useCartStoreA = createCartStore('tienda-a');
const useCartStoreB = createCartStore('tienda-b');

Cada tienda tiene su propio caché en LocalStorage y su propio estado aislado.

