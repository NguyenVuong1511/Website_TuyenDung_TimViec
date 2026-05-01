// ─── Login ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  fullName?: string;
}

// ─── Register – Ứng viên ──────────────────────────────────────────────────────

export interface RegisterCandidateRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;   // "YYYY-MM-DD"
  gender?: string;
  address?: string;
}

// ─── Register – Nhà tuyển dụng ───────────────────────────────────────────────

export interface RegisterRecruiterRequest {
  email: string;
  password: string;
  companyName: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyDescription?: string;
}

// ─── Account Management ───────────────────────────────────────────────────────

export interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ChangeEmailRequest {
  userId: string;
  newEmail: string;
  password: string;
}

export interface UpdateProfileRequest {
  userId: string;
  fullName?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
}

export interface AccountInfo {
  userId: string;
  email: string;
  role: string;
  fullName?: string;
  phone?: string;
  companyName?: string;
}

// ─── Phản hồi chung từ API ────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
