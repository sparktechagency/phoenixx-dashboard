import { api } from "../api/baseApi";

const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateAdminProfile: builder.mutation({
      query: (updatedData) => ({
        url: `/users/update-profile`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query({
      query: () => {
        return {
          url: "/users/profile",
          method: "GET",
        };
      },
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,

  useUpdateAdminProfileMutation,
} = profileApi;
