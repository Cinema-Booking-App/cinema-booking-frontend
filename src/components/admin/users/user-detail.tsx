"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User as UserType, UserStatus } from "@/types/user";
import {
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useVerifyUserMutation,
} from "@/store/slices/users/usersApi";

interface UserDetailDialogProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
  getStatusColor,
  getStatusIcon,
  formatDate,
  formatDateTime,
}: UserDetailDialogProps) {
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [verifyUser] = useVerifyUserMutation();

  if (!user) return null;

  const handleStatusChange = async (status: UserStatus) => {
    await updateUserStatus({ user_id: user.user_id, status });
  };

  const handleDelete = async () => {
    await deleteUser(user.user_id);
    onOpenChange(false);
  };

  const handleVerify = async () => {
    await verifyUser(user.user_id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chi tiết người dùng {user.user_id}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về người dùng và vai trò
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-rows-2 md:grid-rows-2 gap-6">
          {/* Thông tin người dùng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin người dùng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã người dùng:</span>
                <span className="font-medium break-words">{user.user_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium break-words">{user.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="break-words">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="break-words">{user.phone}</span>
                </div>
              )}
              {user.date_of_birth && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày sinh:</span>
                  <span className="break-words">{formatDate(user.date_of_birth)}</span>
                </div>
              )}
              {user.gender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giới tính:</span>
                  <span className="break-words">{user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span className="break-words">{formatDateTime(user.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                <span className="break-words">{formatDateTime(user.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trạng thái và vai trò */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái và vai trò</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(user.status)}
                <Badge className={getStatusColor(user.status)}>
                  {user.status === UserStatus.ACTIVE ? "Hoạt động" : user.status === UserStatus.PENDING ? "Đang chờ" : "Không hoạt động"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Xác minh:</span>
                <Badge variant={user.is_verified ? "default" : "secondary"}>
                  {user.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Điểm tích lũy:</span>
                <span className="font-medium break-words">{user.loyalty_points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng chi tiêu:</span>
                <span className="font-medium break-words">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(user.total_spent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cấp bậc:</span>
                <span className="font-medium break-words">
                </span>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Vai trò:</p>
                <div className="flex gap-2 flex-wrap">
                  {user.roles.map((role) => (
                    <Badge key={role.role_id} variant="outline">
                      {role.role_name === "admin" ? "Quản trị viên" : role.role_name === "staff" ? "Nhân viên" : "Khách hàng"}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {!user.is_verified && (
            <Button variant="outline" onClick={handleVerify}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Xác minh
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleStatusChange(user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {user.status === UserStatus.ACTIVE ? "Vô hiệu hóa" : "Kích hoạt"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa người dùng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}