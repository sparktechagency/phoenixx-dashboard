import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/notifications?recipientRole=admin&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags:["NOTIFICATION"]
    }),
    readOneNotification: builder.mutation({
      query: (id) => {
        return {
          url: `/notifications/mark-single-as-read/${id}`,
          method: "PATCH",
        };
      },
    }),
    readAllNotification: builder.mutation({
      query: () => {
        return {
          url: `/notifications/mark-all-as-read`,
          method: "PATCH",
        };
      },
      invalidatesTags:["NOTIFICATION"]
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useReadOneNotificationMutation,
  useReadAllNotificationMutation,
} = notificationSlice;
