import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { Route } from "@/routes/elections/$id";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Flag, Globe, Hash, Type } from "lucide-react";

export default function ElectionData() {
  const { id } = Route.useParams();
  const { data: election } = useSuspenseQuery(electionByIdQueryOptions(id));

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
              <p className="font-medium">{election.countryShortName}</p>
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
