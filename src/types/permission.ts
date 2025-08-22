export interface Permission {
    permission_id: number;
    permission_name: string;
    description: string;
    module: string;
    actions: string[];
    created_at: string;
    updated_at: string;
}
