import { api } from "../api/baseApi";

const aboutusApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAboutUs: builder.mutation({
      query: (description) => {
        return {
          url: `/about-us/create-about-us`,
          method: "POST",
          body: description,
        };
      },
    }),

    aboutUs: builder.query({
      query: () => {
        return {
          url: "/about-us",
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const { useAboutUsQuery, useCreateAboutUsMutation } = aboutusApi;
