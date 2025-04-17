import { api } from "../api/baseApi";

const faqCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFAQCategory: builder.mutation({
      query: (faqcategoryData) => {
        return {
          url: "/faq-categories/create",
          method: "POST",
          body: faqcategoryData,
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    updateFAQCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/faq-categories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    deleteFAQCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/faq-categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FAQC"],
    }),
    categoryFAQ: builder.query({
      query: () => {
        return {
          url: "/faq-categories",
          method: "GET",
        };
      },
      providesTags: ["FAQC"],
    }),
  }),
});

export const {
  useCategoryFAQQuery,
  useCreateFAQCategoryMutation,
  useDeleteFAQCategoryMutation,
  useUpdateFAQCategoryMutation,
} = faqCategorySlice;
