import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseUrl";
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  // baseUrl: "http://10.0.60.126:6007",
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true");
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
    return headers;
  },
});

export const imageUrl = getBaseUrl();
// export const imageUrl = "http://10.0.60.126:6007";

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["Profile","USER","Users","ABOUT_US","CATEGORY","ADMIN_PROFILE","AUTH","CONTACT","DASHBOARD","FAQC","FEEDBACK","LOGO","NOTIFICATION","PACKAGE","REPORT","SUB_CATEGORY","ADMIN"],
});
