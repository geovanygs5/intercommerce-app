interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <Skeleton className="w-full h-48 mb-4" />
    <Skeleton className="w-3/4 h-4 mb-2" />
    <Skeleton className="w-1/2 h-4 mb-4" />
    <Skeleton className="w-1/4 h-6" />
  </div>
);