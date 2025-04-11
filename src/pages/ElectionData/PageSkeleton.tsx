import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
export default function PageSkeleton() {
  return (
    <div>
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ps-covered">Observers in the field</TabsTrigger>
          <TabsTrigger value="forms-submitted">Forms submitted</TabsTrigger>
          <TabsTrigger value="incidents">Reported incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Skeleton className="h-8 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </TabsContent>

        <TabsContent value="ps-covered">
          <Skeleton className="h-full w-full" />
        </TabsContent>

        <TabsContent value="forms-submitted">
          <Skeleton className="h-full w-full" />
        </TabsContent>

        <TabsContent value="incidents">
          <Skeleton className="h-full w-full" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
