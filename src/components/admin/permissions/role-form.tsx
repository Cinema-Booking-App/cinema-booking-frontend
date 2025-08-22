
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

interface Permission {
  permission_id: number;
  permission_name: string;
  description: string;
  module: string;
  actions: string[];
}

interface Module {
  value: string;
  label: string;
}

interface AddRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role_name: string; description: string; permission_ids: number[] }) => void;
}

export const AddRoleForm: React.FC<AddRoleFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
    permission_ids: [] as number[],
  });
  const [selectedModule, setSelectedModule] = useState("all");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock modules (replace with actual data from backend if available)
  const modules: Module[] = [
    { value: "all", label: "Tất cả module" },
    { value: "movies", label: "Phim" },
    { value: "schedules", label: "Lịch chiếu" },
    { value: "users", label: "Người dùng" },
    { value: "reports", label: "Báo cáo" },
    { value: "system", label: "Hệ thống" },
  ];

  // Fetch permissions from backend
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch("/api/permissions");
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }
        const data: Permission[] = await response.json();
        setPermissions(data);
      } catch (error) {
        
      }
    };
    fetchPermissions();
  }, []);

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
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
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
    setErrors({});
    onClose();
  };

  const filteredPermissions = selectedModule === "all"
    ? permissions
    : permissions.filter((p) => p.module === selectedModule);

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo vai trò mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Info */}
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
            </div>
          </div>
          {/* Permissions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Phân quyền ({formData.permission_ids.length} quyền được chọn)
              </Label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {modules.map((module) => (
                  <option key={module.value} value={module.value}>
                    {module.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="border-b border-gray-100 last:border-b-0">
                  <div className="bg-gray-50 px-4 py-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      {modules.find((m) => m.value === module)?.label || module}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({perms.length} quyền)
                      </span>
                    </h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {perms.map((permission) => (
                      <label
                        key={permission.permission_id}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
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
                            {permission.actions.map((action) => (
                              <span
                                key={action}
                                className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedPermissions).length === 0 && (
                <p className="p-4 text-sm text-gray-500">Không có quyền nào cho module này.</p>
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
            className="px-6 py-3 font-medium flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>Tạo vai trò</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
