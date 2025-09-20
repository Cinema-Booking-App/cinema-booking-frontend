import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield, Users, Settings, Film, Calendar, FileText, Cog } from "lucide-react";
import { Permission } from "@/types/permission";
import { useGetListPermissionsQuery } from "@/store/slices/permissions/permissionsApi";


interface Module {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface AddRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role_name: string; description: string; permission_ids: number[] }) => void;
}


// Enhanced modules with icons and descriptions
const modules: Module[] = [
  { 
    value: "movies", 
    label: "Quản lý Phim", 
    icon: <Film className="w-4 h-4" />,
    description: "Quản lý thông tin phim, thể loại, đạo diễn, diễn viên"
  },
  { 
    value: "theaters", 
    label: "Quản lý Rạp", 
    icon: <Settings className="w-4 h-4" />,
    description: "Quản lý thông tin rạp chiếu, địa điểm, liên hệ"
  },
  { 
    value: "schedules", 
    label: "Lịch Chiếu", 
    icon: <Calendar className="w-4 h-4" />,
    description: "Quản lý lịch chiếu phim, suất chiếu, giờ chiếu"
  },
  { 
    value: "users", 
    label: "Người Dùng", 
    icon: <Users className="w-4 h-4" />,
    description: "Quản lý tài khoản người dùng, phân quyền"
  },
  { 
    value: "reports", 
    label: "Báo Cáo", 
    icon: <FileText className="w-4 h-4" />,
    description: "Xem và tạo các báo cáo thống kê"
  },
  { 
    value: "system", 
    label: "Hệ Thống", 
    icon: <Cog className="w-4 h-4" />,
    description: "Cài đặt hệ thống, cấu hình chung"
  },
];

// Enhanced actions with better descriptions
const actions = [
  { value: "view", label: "Xem", color: "bg-blue-100 text-blue-800", description: "Quyền xem và truy cập thông tin" },
  { value: "create", label: "Tạo mới", color: "bg-green-100 text-green-800", description: "Quyền tạo mới dữ liệu" },
  { value: "update", label: "Cập nhật", color: "bg-yellow-100 text-yellow-800", description: "Quyền chỉnh sửa dữ liệu" },
  { value: "delete", label: "Xóa", color: "bg-red-100 text-red-800", description: "Quyền xóa dữ liệu" },
  { value: "manage", label: "Quản lý", color: "bg-purple-100 text-purple-800", description: "Quyền quản lý toàn bộ" },
  { value: "approve", label: "Phê duyệt", color: "bg-indigo-100 text-indigo-800", description: "Quyền phê duyệt, xác nhận" },
];

export const AddRoleForm: React.FC<AddRoleFormProps> = ({ isOpen, onClose, onSubmit }) => {
  // Lấy danh sách quyền 
  const {data: permissionsList} = useGetListPermissionsQuery();
  const permissions = permissionsList || [];
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
    permission_ids: [] as number[],
  });
  console.log("Permissions List:", formData); 

  // State for filters and errors
  const [selectedModule, setSelectedModule] = useState("all");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Enhanced modules list for filtering
  const moduleOptions = [
    { value: "all", label: "Tất cả module", icon: <Shield className="w-4 h-4" /> },
    ...modules
  ];



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.role_name.trim()) {
      newErrors.role_name = "Tên vai trò là bắt buộc";
    } else if (formData.role_name.length > 255) {
      newErrors.role_name = "Tên vai trò không được quá 255 ký tự";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length > 255) {
      newErrors.description = "Mô tả không được quá 255 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      role_name: "",
      description: "",
      permission_ids: [],
    });
    setSelectedModule("all");
    setSearchTerm("");
    setErrors({});
    onClose();
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesModule = selectedModule === "all" || permission.module === selectedModule;
    const matchesSearch = permission.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Tạo vai trò mới</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="role_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên vai trò *
                </Label>
                <Input
                  id="role_name"
                  name="role_name"
                  type="text"
                  value={formData.role_name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Quản lý rạp chiếu"
                  className={errors.role_name ? "border-red-500" : ""}
                  maxLength={255}
                />
                {errors.role_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.role_name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.role_name.length}/255 ký tự
                </p>
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả vai trò và trách nhiệm..."
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                  maxLength={255}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/255 ký tự
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Phân quyền ({formData.permission_ids.length} quyền được chọn)
              </Label>
            </div>
            
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {moduleOptions.map((module) => (
                    <option key={module.value} value={module.value}>
                      {module.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  placeholder="Tìm kiếm quyền..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([moduleKey, perms]) => {
                const moduleInfo = modules.find(m => m.value === moduleKey);
                return (
                  <div key={moduleKey} className="border-b border-gray-100 last:border-b-0">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        {moduleInfo?.icon || <Shield className="w-4 h-4" />}
                        <span className="ml-2">{moduleInfo?.label || moduleKey}</span>
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          ({perms.length} quyền)
                        </span>
                      </h4>
                      {moduleInfo?.description && (
                        <p className="text-xs text-gray-600 mt-1 ml-6">{moduleInfo.description}</p>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      {perms.map((permission) => (
                        <label
                          key={permission.permission_id}
                          className="flex items-start space-x-3 cursor-pointer hover:bg-blue-50 p-3 rounded-lg border border-transparent hover:border-blue-200 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permission_ids.includes(permission.permission_id)}
                            onChange={() => handlePermissionToggle(permission.permission_id)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {permission.permission_name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {permission.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {permission.actions.map((action) => {
                                const actionInfo = actions.find(a => a.value === action);
                                return (
                                  <span
                                    key={action}
                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${actionInfo?.color || 'bg-gray-100 text-gray-800'}`}
                                  >
                                    {actionInfo?.label || action}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.keys(groupedPermissions).length === 0 && (
                <p className="p-8 text-center text-gray-500">
                  {searchTerm ? "Không tìm thấy quyền nào phù hợp" : "Không có quyền nào cho module này"}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 py-3 font-medium"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 py-3 font-medium flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4" />
            <span>Tạo vai trò</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};