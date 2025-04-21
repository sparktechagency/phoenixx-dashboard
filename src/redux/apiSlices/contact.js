import { api } from "../api/baseApi";

const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateContact: builder.mutation({
      query: (updatedData) => {
        return {
          url: `/contact-us/create-contact-us`,
          method: "POST",
          body: updatedData,
        };
      },
      invalidatesTags: ["Contact"],
    }),

    contact: builder.query({
      query: () => {
        return {
          url: "/contact-us",
          method: "GET",
        };
      },
      providesTags: ["Contact"],
    }),
  }),
});

export const { useContactQuery, useUpdateContactMutation } = contactApi;
