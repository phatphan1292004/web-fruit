interface LoadingSkeletonProps {
  variant?: 'card' | 'table-row' | 'chart' | 'text' | 'avatar';
  count?: number;
}

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
);

const LoadingSkeleton = ({ variant = 'card', count = 1 }: LoadingSkeletonProps) => {
  const items = Array.from({ length: count });

  switch (variant) {
    case 'card':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-7 w-32" />
                  <SkeletonBlock className="h-3 w-28" />
                </div>
                <SkeletonBlock className="w-12 h-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'table-row':
      return (
        <div className="space-y-3">
          {items.map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <SkeletonBlock className="w-10 h-10 rounded-full" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-48 hidden sm:block" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
              <SkeletonBlock className="h-4 w-24 ml-auto" />
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <SkeletonBlock className="h-5 w-40 mb-6" />
          <SkeletonBlock className="h-64 w-full rounded-xl" />
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          {items.map((_, i) => (
            <SkeletonBlock key={i} className="h-4 w-full" />
          ))}
        </div>
      );

    case 'avatar':
      return (
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default LoadingSkeleton;
