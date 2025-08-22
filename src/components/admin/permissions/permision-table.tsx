import { Permission } from "@/types/permission";
import { Settings } from "lucide-react";
import React from "react";


export const PermissionTable: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
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

    const actionNames = {
        read: "Xem",
        create: "Tạo",
        update: "Sửa",
        delete: "Xóa"
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-background rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-background-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-foreground">Danh sách quyền hạn</h3>
                <p className="text-sm text-foreground mt-1">
                    Tổng cộng {permissions.length} quyền trong {Object.keys(groupedPermissions).length} module
                </p>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                Ngày tạo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-gray-200">
                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                            <React.Fragment key={module}>
                                <tr className="bg-background-50">
                                    <td colSpan={5} className="px-6 py-3">
                                        <h4 className="font-semibold text-blue-800 flex items-center">
                                            <Settings className="w-4 h-4 mr-2" />
                                            {moduleNames[module as keyof typeof moduleNames] || module}
                                            <span className="ml-2 text-sm font-normal text-blue-600">
                                                ({perms.length} quyền)
                                            </span>
                                        </h4>
                                    </td>
                                </tr>
                                {perms.map((permission) => (
                                    <tr key={permission.permission_id} className="hover:bg-background-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-foreground">
                                                {permission.permission_name}
                                            </div>
                                            <div className="text-xs text-foreground">
                                                ID: {permission.permission_id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-foreground max-w-xs">
                                                {permission.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {permission.actions.map((action) => (
                                                    <span
                                                        key={action}
                                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            action === 'read' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : action === 'create'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : action === 'update'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : action === 'delete'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {actionNames[action as keyof typeof actionNames] || action}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            {formatDate(permission.created_at)}
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