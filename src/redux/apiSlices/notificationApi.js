import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => {
        return {
          url: `/notifications?recipientRole=admin`,
          method: "GET",
          // headers:{
          //     Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
          // }
        };
      },
    }),
    getRead: builder.query({
      query: (read) => {
        return {
          url: `/notifications?read=${read}`,
          method: "GET",
          // headers:{
          //     Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
          // }
        };
      },
    }),
  }),
});

export const { useGetNotificationQuery, useGetReadQuery } = notificationSlice;
