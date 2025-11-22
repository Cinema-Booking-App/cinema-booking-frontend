import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart, Button } from 'lucide-react';
import Link from 'next/link';

export default function ProfileFavoritesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phim yêu thích</CardTitle>
        <CardDescription>Danh sách các bộ phim bạn đã thêm vào yêu thích</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Bạn chưa có phim yêu thích nào</p>
          <Button asChild className="mt-4">
            <Link href="/">Khám phá phim mới</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
