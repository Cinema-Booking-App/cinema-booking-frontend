import { UserCurrent } from "@/types/user";
import { useState } from "react";

// Hook để sử dụng permissions (có thể dùng ở các component khác)
export const useUserPermissions = () => {
  const [user, ] = useState<UserCurrent | null>(null);
  const [permissions, ] = useState<string[]>([]);
  const [loading, ] = useState(true);

  const hasPermission = (permissionName: string): boolean => {
    if (user?.roles.some(role => role.role_name === 'super_admin')) {
      return true;
    }
    return permissions.includes(permissionName);
  };

  const hasRole = (roleName: string): boolean => {
    return user?.roles.some(role => role.role_name === roleName) || false;
  };

  return { user, permissions, loading, hasPermission, hasRole };
};