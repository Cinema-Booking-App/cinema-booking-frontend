'use client'
import React, { useState } from "react";
import {
    Users,
    Shield,
    Settings,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    UserCheck,
    Lock,
    Unlock,
    Crown,
    UserX,
    CheckCircle,
    XCircle,
    MoreVertical,
    Triangle
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Description } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// Types
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

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin: string;
    avatar?: string;
}

// Mock Data
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

const mockUsers: User[] = [
    {
        id: "1",
        name: "Nguyễn Văn Admin",
        email: "admin@cinema.com",
        role: "super_admin",
        status: "active",
        lastLogin: "2024-03-15 10:30"
    },
    {
        id: "2",
        name: "Trần Thị Manager",
        email: "manager@cinema.com",
        role: "manager",
        status: "active",
        lastLogin: "2024-03-15 09:15"
    },
    {
        id: "3",
        name: "Lê Văn Staff",
        email: "staff@cinema.com",
        role: "staff",
        status: "inactive",
        lastLogin: "2024-03-10 14:20"
    }
];

// Components
const StatsCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    description?: string;
}> = ({ title, value, icon, color, description }) => (
    <div className="bg-background rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                {description && (
                    <p className="text-xs text-foreground mt-1">{description}</p>
                )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

const RoleCard: React.FC<{
    role: Role;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onViewUsers: (role: Role) => void;
}> = ({ role, onEdit, onDelete, onViewUsers }) => (
    <div className="bg-background rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${role.name === 'Super Admin' ? 'bg-red-100' :
                        role.name === 'Admin' ? 'bg-blue-100' :
                            role.name === 'Manager' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    {role.name === 'Super Admin' ? <Crown className="w-5 h-5 text-red-600" /> :
                        role.name === 'Admin' ? <Shield className="w-5 h-5 text-blue-600" /> :
                            role.name === 'Manager' ? <UserCheck className="w-5 h-5 text-green-600" /> :
                                <Users className="w-5 h-5 text-foreground" />}
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-foreground">{role.name}</h3>
                    <p className="text-foreground text-sm">{role.description}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {role.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
                {role.isDefault && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Mặc định
                    </span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-sm text-foreground">Số quyền</p>
                <p className="text-lg font-semibold text-foreground">{role.permissions.length}</p>
            </div>
            <div>
                <p className="text-sm text-foreground">Người dùng</p>
                <p className="text-lg font-semibold text-foreground">{role.userCount}</p>
            </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
                onClick={() => onViewUsers(role)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
                <Eye className="w-4 h-4" />
                <span>Xem người dùng</span>
            </button>
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(role)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                >
                    <Edit className="w-4 h-4" />
                </button>
                {!role.isDefault && (
                    <button
                        onClick={() => onDelete(role)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa vai trò"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    </div>
);

const PermissionTable: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const moduleNames = {
        movies: "Quản lý phim",
        schedules: "Lịch chiếu",
        users: "Người dùng",
        reports: "Báo cáo",
        system: "Hệ thống"
    };

    return (
        <div className="bg-background rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-background border-b border-gray-200">
                <h3 className="text-lg font-semibold text-foreground">Danh sách quyền hạn</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                Module
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                Quyền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-gray-200">
                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                            <React.Fragment key={module}>
                                <tr className="bg-background">
                                    <td colSpan={4} className="px-6 py-3">
                                        <h4 className="font-semibold text-gray-800 flex items-center">
                                            <Settings className="w-4 h-4 mr-2" />
                                            {moduleNames[module as keyof typeof moduleNames] || module}
                                        </h4>
                                    </td>
                                </tr>
                                {perms.map((permission) => (
                                    <tr key={permission.id} className="hover:bg-background">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-foreground">{permission.name}</div>
                                            <div className="text-sm text-foreground">ID: {permission.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-foreground">{permission.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {permission.actions.map((action) => (
                                                    <span
                                                        key={action}
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                    >
                                                        {action}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersTable: React.FC<{
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

// Main Component
export default function PermissionPage() {
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const handleEditRole = (role: Role) => {
        (`Chỉnh sửa vai trò: ${role.name}`);
    };

    const handleDeleteRole = (role: Role) => {
        setSelectedRole(role);
        setShowDeleteDialog(true);
    };

    const handleViewUsers = (role: Role) => {
        (`Xem người dùng có vai trò: ${role.name}`);
    };

    const handleEditUser = (user: User) => {
        (`Chỉnh sửa người dùng: ${user.name}`);
    };

    const handleToggleStatus = (user: User) => {
        const action = user.status === 'active' ? 'khóa' : 'kích hoạt';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${user.name}?`)) {
            (`Đã ${action} tài khoản: ${user.name}`);
        }
    };

    const confirmDeleteRole = () => {
        if (selectedRole) {
            (`Đã xóa vai trò: ${selectedRole.name}`);
            setShowDeleteDialog(false);
            setSelectedRole(null);
        }
    };

    const tabs = [
        { id: 'roles', label: 'Vai trò', icon: Shield },
        { id: 'permissions', label: 'Quyền hạn', icon: Settings },
        { id: 'users', label: 'Người dùng', icon: Users }
    ];

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý phân quyền</h1>
                        <p className="text-foreground">Quản lý vai trò và quyền hạn trong hệ thống</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Tạo vai trò mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title="Tổng vai trò"
                        value={mockRoles.length}
                        icon={<Shield className="w-6 h-6 text-blue-600" />}
                        color="bg-blue-100"
                        description="Số vai trò trong hệ thống"
                    />
                    <StatsCard
                        title="Tổng quyền"
                        value={mockPermissions.length}
                        icon={<Settings className="w-6 h-6 text-green-600" />}
                        color="bg-green-100"
                        description="Số quyền hạn có sẵn"
                    />
                    <StatsCard
                        title="Người dùng"
                        value={mockUsers.length}
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                        color="bg-purple-100"
                        description="Tổng số người dùng"
                    />
                    <StatsCard
                        title="Hoạt động"
                        value={mockUsers.filter(u => u.status === 'active').length}
                        icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
                        color="bg-emerald-100"
                        description="Người dùng đang hoạt động"
                    />
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-foreground hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Tìm kiếm ${activeTab === 'roles' ? 'vai trò' :
                                    activeTab === 'permissions' ? 'quyền hạn' : 'người dùng'
                                }...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-background transition-colors">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Bộ lọc</span>
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'roles' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockRoles
                            .filter(role =>
                                role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                role.description.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((role) => (
                                <RoleCard
                                    key={role.id}
                                    role={role}
                                    onEdit={handleEditRole}
                                    onDelete={handleDeleteRole}
                                    onViewUsers={handleViewUsers}
                                />
                            ))
                        }
                    </div>
                )}

                {activeTab === 'permissions' && (
                    <PermissionTable
                        permissions={mockPermissions.filter(permission =>
                            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            permission.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                    />
                )}

                {activeTab === 'users' && (
                    <UsersTable
                        users={mockUsers.filter(user =>
                            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                        onEditUser={handleEditUser}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xác nhận xóa vai trò</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn xóa vai trò "{selectedRole?.name}"?
                                Hành động này không thể hoàn tác và sẽ ảnh hưởng đến {selectedRole?.userCount} người dùng.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button>Hủy</Button>
                            <Button
                                onClick={confirmDeleteRole}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Xóa vai trò
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}