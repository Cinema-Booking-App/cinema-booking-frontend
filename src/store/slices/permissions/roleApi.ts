import { baseQueryWithAuth } from "@/store/api";
import Role from "@/types/role";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getListRoles: builder.query<Role[],void>({
      query: () => "/roles",
      transformResponse: (response: ApiResponse<Role[]>) => response.data || [],
    }),
    createRole: builder.mutation({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
    }),
    updateRole: builder.mutation({
      query: ({ id, ...updatedRole }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: updatedRole,
      }),
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {useGetListRolesQuery} = roleApi;