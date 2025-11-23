"use client";
import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { UserTable } from "@/components/admin/users/user-table";
import { UserDetailDialog } from "@/components/admin/users/user-detail";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, clearSelectedUser } from "@/store/slices/users/usersSlide";
import { User } from "@/types/user";
import { useGetListUsersQuery } from "@/store/slices/users/usersApi";

export default function ManagementUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const dispatch = useDispatch();
  const selectedUser = useSelector((state: { users: { selectedUser: User | null } }) => state.users.selectedUser);

  // Fetch users from API
  const { data, isLoading, error } = useGetListUsersQuery({
    skip: 0,
    limit: 10,
    search_query: searchTerm || undefined,
  });

  // Helper functions for UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleViewDetails = (user: User) => {
    dispatch(setSelectedUser(user));
  };

  // Ensure users is always an array
  const users = data?.items ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="pending">Đang chờ</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Users Table */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {JSON.stringify(error)}</p>}
      <UserTable
        users={users}
        onViewDetails={handleViewDetails}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        formatDate={formatDate}
      />

      {/* User Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && dispatch(clearSelectedUser())}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
    </div>
  );
}