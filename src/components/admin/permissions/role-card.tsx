import { Crown, Edit, Eye, Shield, Trash2, UserCheck, Users } from "lucide-react";

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
export const RoleCard: React.FC<{
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