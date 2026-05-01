import axiosInstance from './axiosInstance';
import type {
  LoginRequest,
  LoginResponse,
  RegisterCandidateRequest,
  RegisterRecruiterRequest,
  ApiResponse,
  ChangePasswordRequest,
  ChangeEmailRequest,
  UpdateProfileRequest,
  AccountInfo,
} from '../types/auth';

// ─── Tiện ích Quản lý Token ────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

export function getUserRole(): string | null {
  return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
}

export function getUserId(): string | null {
  return localStorage.getItem('userId') || sessionStorage.getItem('userId');
}

export function setAuthData(data: { token: string; role: string; userId: string }, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('authToken', data.token);
  storage.setItem('userRole', data.role);
  storage.setItem('userId', data.userId);
}

export function clearAuthData() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userId');
}

// ─── Đăng nhập ────────────────────────────────────────────────────────────────
export async function loginApi(payload: LoginRequest, remember: boolean = false): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', payload);

  if (!data.data) throw new Error(data.message ?? 'Đăng nhập thất bại');

  // Lưu thông tin vào storage tương ứng
  setAuthData({
    token: data.data.token,
    role: data.data.role,
    userId: data.data.userId,
  }, remember);

  return data.data;
}

// ─── Đăng ký ứng viên ─────────────────────────────────────────────────────────
export async function registerCandidateApi(
  payload: RegisterCandidateRequest
): Promise<ApiResponse> {
  const { data } = await axiosInstance.post<ApiResponse>('/auth/register/candidate', payload);
  return data;
}

// ─── Đăng ký nhà tuyển dụng ──────────────────────────────────────────────────
export async function registerRecruiterApi(
  payload: RegisterRecruiterRequest
): Promise<ApiResponse> {
  const { data } = await axiosInstance.post<ApiResponse>('/auth/register/recruiter', payload);
  return data;
}

// ─── Đăng xuất ───────────────────────────────────────────────────────────────
export function logout() {
  clearAuthData();
}

// ─── Quản lý tài khoản ────────────────────────────────────────────────────────
export async function getAccountInfoApi(userId: string): Promise<ApiResponse<AccountInfo>> {
  const { data } = await axiosInstance.get<ApiResponse<AccountInfo>>(`/auth/account/${userId}`);
  return data;
}

export async function changePasswordApi(payload: ChangePasswordRequest): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.put<ApiResponse<boolean>>('/auth/change-password', payload);
  return data;
}

export async function changeEmailApi(payload: ChangeEmailRequest): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.put<ApiResponse<boolean>>('/auth/change-email', payload);
  return data;
}

export async function updateCandidateProfileApi(payload: UpdateProfileRequest): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.put<ApiResponse<boolean>>('/auth/profile/candidate', payload);
  return data;
}

export async function updateRecruiterProfileApi(payload: UpdateProfileRequest): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.put<ApiResponse<boolean>>('/auth/profile/recruiter', payload);
  return data;
}

