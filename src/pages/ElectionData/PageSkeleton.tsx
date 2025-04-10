import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2 border-b">
        <Skeleton className="h-7 w-3/4" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="w-full">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
