
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

interface Action {
  value: string;
  label: string;
  color: string;
}

interface Module {
  value: string;
  label: string;
}

interface AddPermissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { permission_name: string; description: string; module: string; actions: string[] }) => void;
}

export const AddPermissionForm: React.FC<AddPermissionFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    permission_name: "",
    description: "",
    module: "",
    actions: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Define modules based on the permissions table schema
  const modules: Module[] = [
    { value: "movies", label: "Phim" },
    { value: "schedules", label: "Lịch chiếu" },
    { value: "users", label: "Người dùng" },
    { value: "reports", label: "Báo cáo" },
    { value: "system", label: "Hệ thống" },
  ];

  // Define actions for permissions (can be fetched from API if dynamic)
  const actions: Action[] = [
    { value: "view", label: "Xem", color: "bg-blue-100 text-blue-800" },
    { value: "create", label: "Tạo", color: "bg-green-100 text-green-800" },
    { value: "update", label: "Sửa", color: "bg-yellow-100 text-yellow-800" },
    { value: "delete", label: "Xóa", color: "bg-red-100 text-red-800" },
  ];

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.permission_name.trim()) {
      newErrors.permission_name = "Tên quyền là bắt buộc";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }
    if (!formData.module) {
      newErrors.module = "Module là bắt buộc";
    }
    if (formData.actions.length === 0) {
      newErrors.actions = "Phải chọn ít nhất một hành động";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();

    } else {

    }
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo quyền mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="permission_name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên quyền *
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
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Hành động *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                  <label
                    key={action.value}
                    className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.actions.includes(action.value)}
                      onChange={() => handleActionToggle(action.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${action.color}`}>
                      {action.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.actions && (
                <p className="mt-1 text-sm text-red-600">{errors.actions}</p>
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
            <span>Tạo quyền</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
