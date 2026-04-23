import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface UploadResponse {
  message: string;
  data: {
    url: string;
    filename: string;
    mimetype: string;
  };
}

export const uploadFile = async (
  file: File,
  folder: string = "uploads",
  fileName?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  if (fileName) {
    formData.append("fileName", fileName);
  }

  const { data } = await api.post<UploadResponse>(apiEndpoint.upload.base, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
