import { api } from "../api/baseApi";

const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveWarning: builder.mutation({
      query: ({ id, message }) => {
        return {
          url: `/reports/give-warning/${id}`,
          method: "PATCH",
          body: message,
        };
      },
      invalidatesTags: ["Report"],
    }),
    deleteReportedPost: builder.mutation({
      query: (id) => {
        return {
          url: `/reports/delete-post/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Report"],
    }),
    getReport: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/reports?page=${page}&limit=${limit}`,
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
  useDeleteReportedPostMutation,
} = reportApi;
