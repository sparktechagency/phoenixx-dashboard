import { api } from "../api/baseApi";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUsers: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/users/update-status/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Users"],
    }),

    getUsers: builder.query({
      query: () => {
        return {
          url: "/users/get-all-users",
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUsersMutation } = usersApi;
