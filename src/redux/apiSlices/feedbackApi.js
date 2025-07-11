import { api } from "../api/baseApi";

const feedBackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeedBack: builder.query({
      query: (page, limit) => {
        return {
          url: `/feedbacks?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["FEEDBACK"],
    }),
  }),
});

export const {
  useGetFeedBackQuery,
} = feedBackApi;
