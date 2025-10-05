import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card className="w-48 sm:w-56 lg:w-64 border-border shadow-lg sm:shadow-xl relative overflow-hidden bg-card flex-shrink-0">
      <Skeleton className="w-full h-64 sm:h-72 lg:h-80" />
      <div className="mt-3 sm:mt-4 px-2 space-y-2">
        <Skeleton className="h-3 sm:h-4 w-full" />
        <Skeleton className="h-3 sm:h-4 w-3/4" />
      </div>
      <div className="flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-4 mb-2">
        <Skeleton className="h-6 sm:h-8 w-16 sm:w-20 lg:w-24" />
        <Skeleton className="h-6 sm:h-8 w-14 sm:w-16 lg:w-20" />
      </div>
    </Card>
  );
}

export function MovieSliderSkeleton() {
  return (
    <div className="bg-background relative flex items-center justify-center px-4">
      <div className="w-full max-w-7xl overflow-x-auto">
        <div className="flex gap-4 sm:gap-6 lg:gap-8 pb-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <MovieCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}