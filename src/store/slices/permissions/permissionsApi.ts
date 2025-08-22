import { baseQueryWithAuth } from "@/store/api";
import { Permission } from "@/types/permission";
import { Role } from "@/types/role";
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
  }),
});


export const { useGetListPermissionsQuery } = permissionsApi;