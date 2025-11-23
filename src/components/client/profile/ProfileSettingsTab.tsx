import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bell, Shield, CreditCard } from 'lucide-react';

export default function ProfileSettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Thông báo
          </CardTitle>
          <CardDescription>Quản lý cài đặt thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Thông báo email</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Thông báo SMS</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Thông báo khuyến mãi</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Bảo mật
          </CardTitle>
          <CardDescription>Cài đặt bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <CreditCard className="w-4 h-4 mr-2" />
            Thay đổi mật khẩu
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Bảo mật hai lớp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
