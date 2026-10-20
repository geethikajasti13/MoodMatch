import { Loader2, SearchX, AlertTriangle, BookOpen, type LucideIcon } from 'lucide-react';

export function LoadingState({ label = 'Finding your matches…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-lavender-600">
      <Loader2 size={32} className="animate-spin" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <AlertTriangle size={32} className="text-blush-400" />
      <p className="max-w-sm text-sm text-lavender-800/70">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message,
  icon: Icon = SearchX,
}: {
  title?: string;
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender-50 text-lavender-400">
        <Icon size={28} />
      </div>
      <h3 className="font-serif text-lg font-semibold text-lavender-800">{title}</h3>
      <p className="max-w-sm text-sm text-lavender-800/60">{message}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-4">
        <div className="skeleton mb-2 h-4 w-3/4 rounded" />
        <div className="skeleton mb-3 h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton mt-1 h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}

export function ContentGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <CardGrid>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </CardGrid>
  );
}

export function BookOpenEmpty() {
  return <EmptyState title="" message="" icon={BookOpen} />;
}
