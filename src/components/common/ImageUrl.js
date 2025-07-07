import { getBaseUrl } from "../../utils/baseUrl";

export const getImageUrl = (path) => {
  const imaapiPath = "https://api.mehor.com";
  // const imaapiPath = "http://168.231.64.178:5002";
  // const imaapiPath = "http://10.10.7.37:5002";
  if (!path) {
    return "https://via.placeholder.com/50"; // Return a fallback image
  }

  // Now it's safe to check startsWith
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = getBaseUrl();
    // console.log(baseUrl, path);
    // const baseUrl = "http://10.0.60.126:6007";
    return `${imaapiPath}${path}`;
  }
};
