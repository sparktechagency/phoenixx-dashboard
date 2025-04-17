import { api } from "../api/baseApi";

const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveWarning: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/reports/give-warning/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["Report"],
    }),
    deleteReportedPost: builder.mutation({
      query: (id) => {
        return {
          url: `/reports/delete-post/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Report"],
    }),
    getReport: builder.query({
      query: () => {
        return {
          url: "/reports",
          method: "GET",
        };
      },
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetReportQuery,
  useGiveWarningMutation,
  useDeleteReportedPostMutation
} = reportApi;
