import { api } from "../api/baseApi";

const feedBackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeedBack: builder.query({
      query: () => {
        return {
          url: "/feedbacks",
          method: "GET",
        };
      },
      providesTags: ["Feedback"],
    }),
  }),
});

export const {
  useGetFeedBackQuery,
} = feedBackApi;
