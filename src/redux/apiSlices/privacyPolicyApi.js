import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createPricyPolicy: builder.mutation({
      query: (description) => {
        return {
          url: `/privacy-policy/create-privacy-policy`,
          method: "POST",
          body: description,
        };
      },
    }),
    updatePricyPolicy: builder.mutation({
      query: ({ id, description }) => {
        return {
          url: `/privacy/update-privacy/${id}`,
          method: "PATCH",
          body: { description },
        };
      },
    }),
    privacyPolicy: builder.query({
      query: () => {
        return {
          url: "/privacy-policy",
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const {
  useCreatePricyPolicyMutation,
  useUpdatePricyPolicyMutation,
  usePrivacyPolicyQuery,
} = privacyPolicySlice;
