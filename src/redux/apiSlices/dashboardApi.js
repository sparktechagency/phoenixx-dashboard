import { api } from "../api/baseApi";

const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveWarning: builder.mutation({
      query: ({ id, message }) => {
        return {
          url: `/reports/give-warning/${id}`,
          method: "PATCH",
          body: message,
        };
      },
      invalidatesTags: ["Dashboard"],
    }),
    getTotalusers: builder.query({
      query: () => {
        return {
          url: `/dashboard/monthly-users`,
          method: "GET",
        };
      },
      providesTags: ["Dashboard"],
    }),
    getStats: builder.query({
      query: () => {
        return {
          url: "/dashboard/stats",
          method: "GET",
        };
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGiveWarningMutation,
  useGetTotalusersQuery,
} = dashboardApi;
