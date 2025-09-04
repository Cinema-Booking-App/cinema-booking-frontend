'use client'
import React, { useState } from "react";
import {
    Users,
    Shield,
    Settings,
    Plus,
    Search,
    Filter,
    UserCheck,
} from "lucide-react";

import { RoleCard } from "@/components/admin/permissions/role-card";
import { PermissionTable } from "@/components/admin/permissions/permision-table";
import { UsersTable } from "@/components/admin/permissions/user-table";
import { useCreateRoleMutation, useDeleteRoleMutation, useGetListRolesQuery } from "@/store/slices/permissions/roleApi";
import { useCreateApiPermissionMutation, useGetListPermissionsQuery } from "@/store/slices/permissions/permissionsApi";
import { AddRoleForm } from "@/components/admin/permissions/role-form";
import { AddPermissionForm } from "@/components/admin/permissions/permission-form";
import { CreateRole, Role } from "@/types/role";
import { UserCurrent } from "@/types/user";



const mockUsers: UserCurrent[] = [
    {
        "full_name": "Trần Trân",
        "email": "giaitri12377@gmail.com",
        "status": "active",
        "user_id": 5,
        "roles": [
            {
                "id": "24",
                "role_name": "super_admin",
                "description": "Người quản trị hệ thống cao nhất",
                "role_id": 24,
                "created_at": "2025-08-22T14:22:09.520487+07:00",
                "updated_at": "2025-08-22T14:21:51.140593+07:00",
                "permissions": []
            }
        ],
        "created_at": "2025-08-25T19:07:30.916665+07:00",
        "updated_at": "2025-08-25T19:08:33.403770+07:00",
        "phone_number": "0123456789",
        "lastLogin": "2025-08-25T19:10:00.000000+07:00"
    },
    {
        user_id: 2,
        full_name: 'Nguyễn Văn B',
        email: "giaitri12377@gmail.com",
        phone_number: "0123456789",
        roles: [
            {
                "id": "2",
                "role_name": "Staff",
                "description": "Nhân viên bán vé",
                "role_id": 2,
                "created_at": "2023-08-20T09:00:00Z",
                "updated_at": "2023-08-20T09:00:00Z",
                "permissions": []
            }
        ],
        lastLogin: '2023-08-20 09:15',
        status: 'inactive',
        created_at: '2023-01-15T10:00:00Z',
        updated_at: '2023-07-10T12:00:00Z'
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


// Main Component
export default function PermissionPage() {
    // Lấy danh sách vai trò từ API
    const { data: rolesResponse } = useGetListRolesQuery();
    // Tạo vai trò từ API
    const [createRole] = useCreateRoleMutation();
    // Xóa vai trò từ API
    const [deleteRole] = useDeleteRoleMutation();
    // Lấy danh sách quyền từ API
    const { data: permissionsResponse } = useGetListPermissionsQuery();
    // Tạo quyền từ API
    const [createPermission] = useCreateApiPermissionMutation();

    const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
    const [showAddPermissionDialog, setShowAddPermissionDialog] = useState(false);

    const handleCreateRole = (roleData: CreateRole) => {
        createRole(roleData).unwrap()
            .then(() => {
                setShowAddRoleDialog(false);
            })
            .catch((error) => {
                alert("Tạo vai trò thất bại. Vui lòng thử lại.");
            });
    };

    const handleDeleteRole = (roleId: number) => {
        console.log('Deleting role with ID:', roleId);
        deleteRole(roleId).unwrap()
    };

    const handleCreatePermission = (roleData: any) => {
        console.log('Creating role:', roleData);
        createPermission(roleData).unwrap()
        // alert(`Tạo vai trò thành công!\nTên: ${roleData.role_name}\nMô tả: ${roleData.description}\nSố quyền: ${roleData.permission_ids.length}`);
    };
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles');
    const [searchTerm, setSearchTerm] = useState('');

    const handleEditRole = (role: Role) => {
        alert(`Chỉnh sửa vai trò: ${role.role_name}`);
    };


    const handleViewUsers = (role: Role) => {
        alert(`Xem người dùng với vai trò: ${role.role_name}`);
    };

    const handleEditUser = (user: UserCurrent) => {
        (`Chỉnh sửa người dùng: ${user.full_name}`);
    };

    const handleToggleStatus = (user: UserCurrent) => {
        const action = user.status === 'active' ? 'khóa' : 'kích hoạt';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${user.full_name}?`)) {
            (`Đã ${action} tài khoản: ${user.full_name}`);
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
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowAddPermissionDialog(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo quyền mới
                        </button>
                        <button
                            onClick={() => setShowAddRoleDialog(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo vai trò mới
                        </button>
                    </div>
                    <AddRoleForm
                        isOpen={showAddRoleDialog}
                        onClose={() => setShowAddRoleDialog(false)}
                        onSubmit={handleCreateRole}
                    />

                    <AddPermissionForm
                        isOpen={showAddPermissionDialog}
                        onClose={() => setShowAddPermissionDialog(false)}
                        onSubmit={handleCreatePermission}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* <StatsCard
                        title="Tổng vai trò"
                        value={mockRoles.length}
                        icon={<Shield className="w-6 h-6 text-blue-600" />}
                        color="bg-blue-100"
                        description="Số vai trò trong hệ thống"
                    /> */}
                    <StatsCard
                        title="Tổng quyền"
                        value={permissionsResponse?.length || 0}
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
                        {(rolesResponse ?? [])
                            .filter(role =>
                                role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                role.description?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((role) => (
                                <RoleCard
                                    key={role.role_id}
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
                        permissions={permissionsResponse
                            ?.filter(permission =>
                                permission.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
                            ) || []
                        }
                    />
                )}

                {activeTab === 'users' && (
                    <UsersTable
                        users={mockUsers.filter(user =>
                            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                        onEditUser={handleEditUser}
                        onToggleStatus={handleToggleStatus}
                    />
                )}
            </div>
        </div>
    );
}