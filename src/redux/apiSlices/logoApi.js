import { api } from "../api/baseApi";

const logoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadLogo: builder.mutation({
      query: (updatedData) => ({
        url: `/website-logo/upload`,
        method: "POST",
        body: updatedData,
      }),
      invalidatesTags: ["LOGO"],
    }),
    getLogo: builder.query({
      query: () => ({
        url: `/website-logo`,
        method: "GET",
      }),
      providesTags: ["LOGO"],
    }),
  }),
});

export const { useUploadLogoMutation, useGetLogoQuery } = logoApi;
