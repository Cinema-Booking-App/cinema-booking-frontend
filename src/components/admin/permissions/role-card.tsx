import { Role } from "@/types/role";
import { Crown, Edit, Eye, Shield, Trash2, UserCheck, Users } from "lucide-react";

interface Permission {
    permission_id: number;
    permission_name: string;
    description: string;
    module: string;
    actions: string[];
}



export const RoleCard: React.FC<{
    role: Role;
    onEdit?: (role: Role) => void;
    onDelete?: (role: Role) => void;
    onViewUsers?: (role: Role) => void;
}> = ({ role, onEdit, onDelete, onViewUsers }) => {
    const getRoleIcon = (roleName: string) => {
        if (roleName.includes('Super Admin')) return <Crown className="w-5 h-5 text-red-600" />;
        if (roleName.includes('Admin')) return <Shield className="w-5 h-5 text-blue-600" />;
        if (roleName.includes('Manager')) return <UserCheck className="w-5 h-5 text-green-600" />;
        return <Users className="w-5 h-5 text-gray-600" />;
    };

    const getRoleColor = (roleName: string) => {
        if (roleName.includes('Super Admin')) return 'bg-red-100';
        if (roleName.includes('Admin')) return 'bg-blue-100';
        if (roleName.includes('Manager')) return 'bg-green-100';
        return 'bg-gray-100';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getRoleColor(role.role_name)}`}>
                        {getRoleIcon(role.role_name)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{role.role_name}</h3>
                        <p className="text-gray-600 text-sm">{role.description}</p>
                    </div>
                </div>
                {/* <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        role.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {role.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                    {role.is_default && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Mặc định
                        </span>
                    )}
                </div> */}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-600">Số quyền</p>
                    <p className="text-lg font-semibold text-gray-900">{role.permission_count || 0}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Người dùng</p>
                    <p className="text-lg font-semibold text-gray-900">{role.user_count || 0}</p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                {onViewUsers && (
                    <button
                        onClick={() => onViewUsers(role)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Xem người dùng</span>
                    </button>
                )}
                <div className="flex space-x-2">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(role)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
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
};