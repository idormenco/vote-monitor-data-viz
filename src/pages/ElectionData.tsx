import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useElectionById } from "@/hooks/use-elections";
import { Route } from "@/routes/elections/$id";
import { Calendar, Flag, Globe, Hash, Type } from "lucide-react";

export default function ElectionData() {
  const { id } = Route.useParams();
  const { data: election, isLoading } = useElectionById(id);

  if (isLoading) {
    return <ElectionCardSkeleton />;
  }

  if (!election) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Election not found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl font-bold">{election.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Type className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                English Title
              </p>
              <p className="font-medium">{election.englishTitle}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Start Date
              </p>
              <p className="font-medium">{election.startDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Flag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Country
              </p>
              <p className="font-medium">{election.country}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="font-medium">{election.slug}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-medium text-sm font-mono">{election.id}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ElectionCardSkeleton() {
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
