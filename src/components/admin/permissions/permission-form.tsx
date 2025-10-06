import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield, Plus, Users, Settings, Film, Calendar, FileText, Cog } from "lucide-react";
import { AddRoleForm } from "./role-form";



interface Module {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface AddPermissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { permission_name: string; description: string; module: string; actions: string[] }) => void;
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



export const AddPermissionForm: React.FC<AddPermissionFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    permission_name: "",
    description: "",
    module: "",
    actions: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleActionToggle = (actionValue: string) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.includes(actionValue)
        ? prev.actions.filter((a) => a !== actionValue)
        : [...prev.actions, actionValue],
    }));
    if (errors.actions) {
      setErrors((prev) => ({
        ...prev,
        actions: "",
      }));
    }
  };


  const handleSubmit = () => {
      onSubmit(formData);
      handleClose();
  };

  const handleClose = () => {
    setFormData({
      permission_name: "",
      description: "",
      module: "",
      actions: [],
    });
    setErrors({});
    onClose();
  };

  const selectedModule = modules.find(m => m.value === formData.module);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Tạo quyền mới</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Thông tin quyền</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="permission_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên quyền * <span className="text-xs text-gray-500">(snake_case)</span>
                </Label>
                <Input
                  id="permission_name"
                  name="permission_name"
                  type="text"
                  value={formData.permission_name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: manage_movies"
                  className={errors.permission_name ? "border-red-500" : ""}
                  maxLength={255}
                />
                {errors.permission_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.permission_name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Chỉ sử dụng chữ thường, số và dấu gạch dưới
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
                  placeholder="Mô tả chi tiết về quyền này..."
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </Label>
                <select
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.module ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn module</option>
                  {modules.map((module) => (
                    <option key={module.value} value={module.value}>
                      {module.label}
                    </option>
                  ))}
                </select>
                {errors.module && (
                  <p className="mt-1 text-sm text-red-600">{errors.module}</p>
                )}
                {selectedModule && (
                  <p className="mt-2 text-xs text-gray-600 flex items-center">
                    {selectedModule.icon}
                    <span className="ml-1">{selectedModule.description}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

         <div>
  <Label className="block text-sm font-medium text-gray-700 mb-2">
    Hành động * <span className="text-xs text-gray-500">({formData.actions.length} được chọn)</span>
  </Label>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
    {actions.map((action) => (
      <label
        key={action.value}
        className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md hover:bg-gray-50 transition-colors"
      >
        <input
          type="checkbox"
          checked={formData.actions.includes(action.value)}
          onChange={() => handleActionToggle(action.value)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${action.color}`}>
              {action.label}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5 truncate">{action.description}</p>
        </div>
      </label>
    ))}
  </div>
  {errors.actions && (
    <p className="mt-2 text-sm text-red-600">{errors.actions}</p>
  )}
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
            className="px-6 py-3 font-medium flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo quyền</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Demo component to show both forms
export default function RolePermissionDemo() {
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);

  const handleRoleSubmit = (data: { role_name: string; description: string; permission_ids: number[] }) => {
    console.log("Role data:", data);
  };

  const handlePermissionSubmit = (data: { permission_name: string; description: string; module: string; actions: string[] }) => {
    console.log("Permission data:", data);
  };
  return (
    <div className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Vai trò và Quyền</h1>
        <p className="text-gray-600">Hệ thống quản lý phân quyền cho ứng dụng rạp chiếu phim</p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setShowRoleForm(true)}
          className="flex items-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>Tạo Vai trò</span>
        </Button>
        <Button 
          onClick={() => setShowPermissionForm(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Quyền</span>
        </Button>
      </div>

      <AddRoleForm
        isOpen={showRoleForm}
        onClose={() => setShowRoleForm(false)}
        onSubmit={handleRoleSubmit}
      />
      
      <AddPermissionForm
        isOpen={showPermissionForm}
        onClose={() => setShowPermissionForm(false)}
        onSubmit={handlePermissionSubmit}
      />
    </div>
  );
}