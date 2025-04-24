import { api } from "../api/baseApi";

const logoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadLogo: builder.mutation({
      query: (updatedData) => ({
        url: `/website-logo/upload`,
        method: "POST",
        body: updatedData,
      }),
      invalidatesTags: ["Logo"],
    }),
    getLogo: builder.query({
      query: () => ({
        url: `/website-logo`,
        method: "GET",
      }),
      providesTags: ["Logo"],
    }),
  }),
});

export const { useUploadLogoMutation, useGetLogoQuery } = logoApi;
