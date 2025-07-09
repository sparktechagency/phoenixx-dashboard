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
      invalidatesTags: ["DASHBOARD"],
    }),
    getTotalusers: builder.query({
      query: (year) => {
        return {
          url: `/dashboard/monthly-users?year=${year}`,
          method: "GET",
        };
      },
      providesTags: ["DASHBOARD"],
    }),
    getStats: builder.query({
      query: () => {
        return {
          url: "/dashboard/stats",
          method: "GET",
        };
      },
      providesTags: ["DASHBOARD"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGiveWarningMutation,
  useGetTotalusersQuery,
} = dashboardApi;
