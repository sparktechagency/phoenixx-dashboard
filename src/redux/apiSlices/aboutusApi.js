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
      invalidatesTags:["ABOUT_US"]
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
      providesTags:["ABOUT_US"]
    }),
    
  }),
});

export const { useAboutUsQuery, useCreateAboutUsMutation } = aboutusApi;
