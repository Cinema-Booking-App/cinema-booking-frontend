import { baseQueryWithAuth } from "@/store/api";
import { CreateRole, Role } from "@/types/role";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getListRoles: builder.query<Role[],void>({
      query: () => "/roles",
      transformResponse: (response: ApiResponse<Role[]>) => response.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ role_id }) => ({ type: "Roles" as const, id: role_id })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),
    createRole: builder.mutation<Role,CreateRole>({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...updatedRole }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: updatedRole,
      }),
    }),
    deleteRole: builder.mutation<void,number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),
  }),
});


export const {useGetListRolesQuery,useCreateRoleMutation,useDeleteRoleMutation} = roleApi;