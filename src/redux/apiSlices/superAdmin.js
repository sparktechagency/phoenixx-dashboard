import { api } from "../api/baseApi";

const superAdminSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "/users/create-admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Admin"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/users/update-admin/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["Admin"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `/users/delete-admin/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Admin"],
    }),
    getAllAdmin: builder.query({
      query: () => {
        return {
          url: "/users/all-admin",
          method: "GET",
        };
      },
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetAllAdminQuery,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
} = superAdminSlice;
