import { api } from "../api/baseApi";

const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/subcategories/create-subcategory",
          method: "POST",
          body: categoryData,
        };
      },
      invalidatesTags: ["SUB_CATEGORY"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/subcategories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["SUB_CATEGORY"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/subcategories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["SUB_CATEGORY"],
    }),
    getSubCategories: builder.query({
      query: () => {
        return {
          url: "/subcategories",
          method: "GET",
        };
      },
      providesTags: ["SUB_CATEGORY"],
    }),
    getSubCategoriesByCatID: builder.query({
      query: (catID) => {
        return {
          url: `/subcategories/subcategories-by-category/${catID}`,
          method: "GET",
        };
      },
      providesTags: ["SUB_CATEGORY"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoriesByCatIDQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategorySlice;
