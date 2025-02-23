import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

// Mock news data (Replace with API integration)
const newsArticles = [
  {
    id: 1,
    title: 'New Climate-Resistant Crops Introduced',
    source: 'AgriDaily',
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    title: 'Government Announces Subsidy for Organic Farming',
    source: 'Farmers Weekly',
    timeAgo: '5 hours ago',
  },
  {
    id: 3,
    title: 'AI-Powered Drones Now Helping Farmers',
    source: 'TechAgri News',
    timeAgo: '1 day ago',
  },
];

export function RecentSales() {
  return (
    <Card className="min-h-[435px]">
      <CardHeader>
        <CardTitle>Latest Agri-News</CardTitle>
        <CardDescription>Stay updated with recent agricultural trends.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {newsArticles.map((article) => (
            <div key={article.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{article.source.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">{article.title}</p>
                <p className="text-sm text-muted-foreground">{article.source}</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">{article.timeAgo}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
