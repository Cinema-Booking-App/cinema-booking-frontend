import { Settings } from "lucide-react";
import React from "react";

interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
    actions: string[];
}
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