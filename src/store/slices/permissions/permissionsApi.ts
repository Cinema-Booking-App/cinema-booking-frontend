import { baseQueryWithAuth } from "@/store/api";
import { Permission } from "@/types/permission";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getListPermissions: builder.query<Permission[], void>({
      query: () => "/permissions",
      transformResponse: (response: ApiResponse<Permission[]>) => response.data || [],
    }),
    createApiPermission: builder.mutation<Permission, Partial<Permission>>({
      query: (newPermission) => ({
        url: "/permissions",
        method: "POST",
        body: newPermission,
      }),
    }),
    updateApiPermission: builder.mutation<Permission, { id: number; data: Partial<Permission> }>({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteApiPermission: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
    }),
  }),

});


export const { useGetListPermissionsQuery,useCreateApiPermissionMutation } = permissionsApi;