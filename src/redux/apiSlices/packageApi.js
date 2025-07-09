import { api } from "../api/baseApi";

const packageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPackage: builder.mutation({
      query: (data) => {
        return {
          url: "/packages/create-package",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["PACKAGE"],
    }),
    updatePackage: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/packages/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["PACKAGE"],
    }),
    deletePackage: builder.mutation({
      query: (id) => {
        return {
          url: `/packages/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["PACKAGE"],
    }),

    getPackage: builder.query({
      query: () => {
        return {
          url: `/packages`,
          method: "GET",
        };
      },
      providesTags: ["PACKAGE"],
    }),
  }),
});

export const {
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useCreatePackageMutation,
  useGetPackageQuery,
} = packageApi;
