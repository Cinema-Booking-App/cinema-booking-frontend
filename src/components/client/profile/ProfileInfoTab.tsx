import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera } from 'lucide-react';
import ProfileHeader from './ProfileHeader';

export default function ProfileInfoTab({
  isEditing,
  isLoading,
  errors,
  formData,
  userData,
  me,
  handleInputChange,
  handleSave,
  handleCancel
}: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
          </div>
          {!isEditing ? (
            <Button className='text-destructive' onClick={() => handleSave()} variant="outline">
              <Edit className="w-4 h-4 mr-2 " />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar, tên, email, điểm, hạng: dùng component riêng */}
        <ProfileHeader userData={userData} me={me} />
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ...input fields... */}
        </div>
      </CardContent>
    </Card>
  );
}
