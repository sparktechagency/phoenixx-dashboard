import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createTermsAndConditions: builder.mutation({
      query: (description) => {
        return {
          url: `/terms-and-conditions/create-terms-and-conditions`,
          method: "POST",
          body: description,
        };
      },
    }),
    updateTermsAndConditions: builder.mutation({
      query: ({ id, description }) => {
        return {
          url: `/terms-and-condition/update-terms-and-condition/${id}`,
          method: "PATCH",
          body: { description },
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
    }),
    termsAndCondition: builder.query({
      query: () => {
        return {
          url: "/terms-and-conditions",
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const {
  useCreateTermsAndConditionsMutation,
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionSlice;
