import { Permission } from "./permission";

export  interface Role {
    id: string;
    role_id: number;
    role_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    permission_count?: number;
    user_count?: number;
    permissions?: Permission[];
}
export interface CreateRole {
    role_name: string;
    description: string;
    permission_ids: number[];
}