import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-otp",
          body: data,
        };
      },
      invalidatesTags:["AUTH"]
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
      invalidatesTags:["AUTH"]
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forget-password",
          body: data,
        };
      },
      invalidatesTags:["AUTH"]
    }),
    resetPassword: builder.mutation({
      query: (value) => {
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: value,
          headers: {
            Authorization: localStorage.getItem("otpSuccessToken"),
          },
        };
      },
      invalidatesTags:["AUTH"]
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
        };
      },
      invalidatesTags:["AUTH"]
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/update-profile",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      invalidatesTags:["ADMIN_PROFILE"]
    }),

    profile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/auth/get-profile",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      transformResponse: ({ user }) => {
        return user;
      },
      providesTags:["ADMIN_PROFILE"]
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
