import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsSectionLoader() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
