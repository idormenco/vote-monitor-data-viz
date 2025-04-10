import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CountriesCoveredMapSkeleton() {
  return (
    <Tabs defaultValue="world-map">
      <TabsList>
        <TabsTrigger value="world-map">Vote Monitor on the map</TabsTrigger>
        <TabsTrigger value="data-table">Data</TabsTrigger>
      </TabsList>
      <TabsContent value="world-map">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="w-full h-[calc(100vh-300px)]">
              <Skeleton className="w-full h-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="data-table">
        <Card>
          <CardContent className="p-4">
            {/* Table header skeleton */}
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>

            {/* Table skeleton */}
            <div className="border rounded-md">
              {/* Header row */}
              <div className="flex border-b p-4">
                <Skeleton className="h-5 w-1/4 mr-4" />
                <Skeleton className="h-5 w-1/4 mr-4" />
                <Skeleton className="h-5 w-1/4 mr-4" />
                <Skeleton className="h-5 w-1/4" />
              </div>

              {/* Data rows */}
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex p-4 border-b last:border-0">
                    <Skeleton className="h-5 w-1/4 mr-4" />
                    <Skeleton className="h-5 w-1/4 mr-4" />
                    <Skeleton className="h-5 w-1/4 mr-4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between py-4 mt-4">
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
