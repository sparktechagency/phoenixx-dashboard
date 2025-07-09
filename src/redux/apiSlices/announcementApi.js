
import { api } from "../api/baseApi";

const announcementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/announcement-slider/create", // Use the correct API endpoint
          method: "POST",
          body: categoryData, // Only image and status will be sent
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/announcement-slider/${id}`, // Update announcement
          method: "PATCH",
          body: formData, // Only image and status will be sent
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    deleteAnnouncement: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/announcement-slider/${id}`, // Delete announcement
          method: "DELETE",
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),

    getAnnouncement: builder.query({
      query: () => {
        return {
          url: "/announcement-slider", // Fetch all announcements
          method: "GET",
        };
      },
      providesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useGetAnnouncementQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
