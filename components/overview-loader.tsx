import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewLoader() {
  return (
    <Card className="h-[450px] flex flex-col justify-between">
      <CardHeader className="flex items-center gap-x-2 flex-row space-y-0">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  );
}