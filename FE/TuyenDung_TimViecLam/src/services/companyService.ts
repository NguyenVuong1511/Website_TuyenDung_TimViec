import axiosInstance from './axiosInstance';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  website?: string;
  description?: string;
  isVerified: boolean;
  industry?: string;
  size?: string;
  phone?: string;
  email?: string;
  cover?: string;
  culture?: string;
  benefits?: string;
}

export const getMyCompanyApi = async (userId: string) => {
  const response = await axiosInstance.get(`/companies/my-company/${userId}`);
  return response.data;
};

export const updateCompanyApi = async (company: Company) => {
  const response = await axiosInstance.put('/companies', company);
  return response.data;
};

export const getCompanyByIdApi = async (id: string) => {
  const response = await axiosInstance.get(`/companies/${id}`);
  return response.data;
};
