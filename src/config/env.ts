export const env = {
  API_URL: import.meta.env.VITE_API_URL || "",
  IS_API_ENABLED: Boolean(import.meta.env.VITE_API_URL),
};
