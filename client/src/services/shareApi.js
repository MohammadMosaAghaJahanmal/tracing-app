import { api } from "./api";

export const getShareRequest = () => api.get("/content/share-request");

export const uploadShare = (formData) =>
  api.post("/tracking/share", formData, { headers: { "Content-Type": "multipart/form-data" } });
