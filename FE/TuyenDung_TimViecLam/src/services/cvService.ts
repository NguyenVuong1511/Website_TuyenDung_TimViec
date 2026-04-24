import axiosInstance from './axiosInstance';
import type { CVResponse } from '../types/cv';

export async function getCVByUserId(userId: string): Promise<CVResponse> {
  const { data } = await axiosInstance.get<CVResponse>(`/cvs/user/${userId}`);
  return data;
}

export async function uploadAvatar(userId: string, file: File): Promise<{ success: boolean; message: string; data?: string }> {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('file', file);

  const { data } = await axiosInstance.post('/api/Upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}
