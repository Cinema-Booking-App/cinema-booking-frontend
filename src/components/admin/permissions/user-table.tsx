import { Edit, Unlock,Lock, XCircle, CheckCircle } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin: string;
    avatar?: string;
}
interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
    actions: string[];
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userCount: number;
    isDefault: boolean;
    createdAt: string;
    status: 'active' | 'inactive';
}

const mockPermissions: Permission[] = [
    {
        id: "movie_view",
        name: "Xem phim",
        description: "Xem thông tin phim",
        module: "movies",
        actions: ["read"]
    },
    {
        id: "movie_manage",
        name: "Quản lý phim",
        description: "Thêm, sửa, xóa phim",
        module: "movies",
        actions: ["create", "update", "delete"]
    },
    {
        id: "schedule_view",
        name: "Xem lịch chiếu",
        description: "Xem thông tin lịch chiếu",
        module: "schedules",
        actions: ["read"]
    },
    {
        id: "schedule_manage",
        name: "Quản lý lịch chiếu",
        description: "Thêm, sửa, xóa lịch chiếu",
        module: "schedules",
        actions: ["create", "update", "delete"]
    },
    {
        id: "user_view",
        name: "Xem người dùng",
        description: "Xem thông tin người dùng",
        module: "users",
        actions: ["read"]
    },
    {
        id: "user_manage",
        name: "Quản lý người dùng",
        description: "Thêm, sửa, xóa người dùng",
        module: "users",
        actions: ["create", "update", "delete"]
    },
    {
        id: "report_view",
        name: "Xem báo cáo",
        description: "Xem các báo cáo thống kê",
        module: "reports",
        actions: ["read"]
    },
    {
        id: "system_config",
        name: "Cấu hình hệ thống",
        description: "Cấu hình các thiết lập hệ thống",
        module: "system",
        actions: ["create", "update", "delete"]
    }
];
const mockRoles: Role[] = [
    {
        id: "super_admin",
        name: "Super Admin",
        description: "Quản trị viên cao nhất với tất cả quyền hạn",
        permissions: mockPermissions.map(p => p.id),
        userCount: 2,
        isDefault: true,
        createdAt: "2024-01-01",
        status: "active"
    },
    {
        id: "admin",
        name: "Admin",
        description: "Quản trị viên với quyền quản lý cơ bản",
        permissions: ["movie_view", "movie_manage", "schedule_view", "schedule_manage", "user_view", "report_view"],
        userCount: 5,
        isDefault: true,
        createdAt: "2024-01-15",
        status: "active"
    },
    {
        id: "manager",
        name: "Manager",
        description: "Quản lý với quyền hạn trung gian",
        permissions: ["movie_view", "schedule_view", "schedule_manage", "user_view", "report_view"],
        userCount: 8,
        isDefault: false,
        createdAt: "2024-02-01",
        status: "active"
    },
    {
        id: "staff",
        name: "Staff",
        description: "Nhân viên với quyền cơ bản",
        permissions: ["movie_view", "schedule_view", "user_view"],
        userCount: 15,
        isDefault: false,
        createdAt: "2024-02-15",
        status: "active"
    }
];
export const UsersTable: React.FC<{
    users: User[];
    onEditUser: (user: User) => void;
    onToggleStatus: (user: User) => void;
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
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-background">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                                        <div className="text-sm text-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {mockRoles.find(r => r.id === user.role)?.name || user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                {user.lastLogin}
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
                                        className={`p-1 rounded ${user.status === 'active'
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