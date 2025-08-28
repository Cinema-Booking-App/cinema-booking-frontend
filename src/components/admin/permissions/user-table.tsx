import { Permission } from "@/types/permission";
import { Role } from "@/types/role";
import { User, UserCurrent } from "@/types/user";
import { Edit, Unlock, Lock, XCircle, CheckCircle } from "lucide-react";

const mockPermissions: Permission[] = [
    {
        permission_id: 1,
        permission_name: "Xem phim",
        description: "Xem thông tin phim",
        module: "movies",
        actions: ["read"]
    },
    {
        permission_id: 2,
        permission_name: "Quản lý phim",
        description: "Thêm, sửa, xóa phim",
        module: "movies",
        actions: ["create", "update", "delete"]
    },
    {
        permission_id: 3,
        permission_name: "Xem lịch chiếu",
        description: "Xem thông tin lịch chiếu",
        module: "schedules",
        actions: ["read"]
    },
    {
        permission_id: 4,
        permission_name: "Quản lý lịch chiếu",
        description: "Thêm, sửa, xóa lịch chiếu",
        module: "schedules",
        actions: ["create", "update", "delete"]
    },
    {
        permission_id: 5,
        permission_name: "Xem người dùng",
        description: "Xem thông tin người dùng",
        module: "users",
        actions: ["read"]
    },
    {
        permission_id: 6,
        permission_name: "Quản lý người dùng",
        description: "Thêm, sửa, xóa người dùng",
        module: "users",
        actions: ["create", "update", "delete"]
    },
    {
        permission_id: 7,
        permission_name: "Xem báo cáo",
        description: "Xem các báo cáo thống kê",
        module: "reports",
        actions: ["read"]
    }
];

const mockRoles: Role[] = [
    {
        role_id: 1,
        role_name: "Admin",
        description: "Quản trị viên hệ thống",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        permissions: mockPermissions,
        id: "1",
        permission_count: mockPermissions.length,
        user_count: 5
    },
    {
        role_id: 2,
        role_name: "Staff",
        description: "Nhân viên bán vé",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        permissions: mockPermissions.filter(p => ["Xem phim", "Xem lịch chiếu", "Xem người dùng"].includes(p.permission_name)),
        id: "2",
        permission_count: 3,
        user_count: 10
    },
    {
        role_id: 3,
        role_name: "Customer",
        description: "Khách hàng",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        permissions: mockPermissions.filter(p => p.permission_name === "Xem phim"),
        id: "3",
        permission_count: 1,
        user_count: 100
    }
];

// Helper function để lấy tên vai trò
const getRoleName = (userRoles: any[]) => {
    if (!userRoles || userRoles.length === 0) {
        return "Không có vai trò";
    }
    
    const userRole = userRoles[0];
    
    // Trường hợp 1: Nếu role_name có sẵn từ API
    if (userRole.role_name) {
        return userRole.role_name;
    }
    
    // Trường hợp 2: Tìm trong mockRoles bằng role_id
    const mockRole = mockRoles.find(r => r.role_id === userRole.role_id);
    if (mockRole) {
        return mockRole.role_name;
    }
    
    return "Không xác định";
};

export const UsersTable: React.FC<{
    users: UserCurrent[];
    onEditUser: (user: UserCurrent) => void;
    onToggleStatus: (user: UserCurrent) => void;
}> = ({ users, onEditUser, onToggleStatus }) => (
    <div className="bg-background rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-background">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                            Người dùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                            Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                            Lần đăng nhập cuối
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                    {users.map((user: UserCurrent) => (
                        <tr key={user.user_id} className="hover:bg-muted/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {(user.full_name)}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground">{user.full_name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {getRoleName(user.roles)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.status === 'active' ? (
                                        <>
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Hoạt động
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Tạm khóa
                                        </>
                                    )}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {user.lastLogin || "Chưa đăng nhập"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditUser(user)}
                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onToggleStatus(user)}
                                        className={`p-1 rounded ${
                                            user.status === 'active'
                                                ? 'text-red-600 hover:text-red-900 hover:bg-red-100'
                                                : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                                        }`}
                                        title={user.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                                    >
                                        {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);