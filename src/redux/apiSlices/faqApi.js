import { api } from "../api/baseApi";

const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFAQ: builder.mutation({
      query: (faqData) => {
        return {
          url: "/faqs/create-faq",
          method: "POST",
          body: faqData,
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/faqs/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => {
        return {
          url: `/faqs/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    getFAQ: builder.query({
      query: (id) => {
        return {
          url: `/faqs?category=${id}`,
          method: "GET",
        };
      },
      providesTags: ["FAQC"],
    }),
  }),
});

export const {
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetFAQQuery,
} = faqApi;
