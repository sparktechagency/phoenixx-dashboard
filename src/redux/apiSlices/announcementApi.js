// import { api } from "../api/baseApi";

// const announcementApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     createAnnouncement: builder.mutation({
//       query: (categoryData) => {
//         return {
//           url: "/announcement-slider/create",
//           method: "POST",
//           body: categoryData,
//         };
//       },
//       invalidatesTags: ["Category"],
//     }),
//     updateAnnouncement: builder.mutation({
//       query: ({ id, formData }) => {
//         return {
//           url: `/categories/${id}`,
//           method: "PATCH",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["Category"],
//     }),

//     getAnnouncement: builder.query({
//       query: () => {
//         return {
//           url: "/announcement-slider",
//           method: "GET",
//         };
//       },
//       providesTags: ["Category"],
//     }),
//   }),
// });

// export const {
//   useCreateAnnouncementMutation,
//   useGetAnnouncementQuery,
//   useUpdateAnnouncementMutation,
// } = announcementApi;

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
      invalidatesTags: ["Category"],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/announcement-slider/${id}`, // Update announcement
          method: "PATCH",
          body: formData, // Only image and status will be sent
        };
      },
      invalidatesTags: ["Category"],
    }),

    getAnnouncement: builder.query({
      query: () => {
        return {
          url: "/announcement-slider", // Fetch all announcements
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useGetAnnouncementQuery,
  useUpdateAnnouncementMutation,
} = announcementApi;
