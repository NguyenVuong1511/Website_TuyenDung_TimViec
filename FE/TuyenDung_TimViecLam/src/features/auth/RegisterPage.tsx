import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Eye, EyeOff, User, Mail, Lock, ArrowRight, ArrowBigLeft,
  Building2, Globe, MapPin, FileText, Phone, Calendar, Loader2,
  CircleCheck, TriangleAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerCandidateApi, registerRecruiterApi, getToken, clearAuthData } from '../../services/authService';
import { isTokenExpired } from '../../utils/jwt';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1.5';

const SectionDivider = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 pt-1">
    <div className="flex-1 h-px bg-indigo-100" />
    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-indigo-100" />
  </div>
);

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      navigate('/');
    } else if (token && isTokenExpired(token)) {
      // Clear token nếu đã hết hạn để không bị rác
      clearAuthData();
    }
  }, [navigate]);

  // ── Form state chung ──────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── Ứng viên ──────────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // ── Nhà tuyển dụng ────────────────────────────────────────────────────────
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  // Refs để focus vào ô input lỗi
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  // Helper: hiện lỗi + focus vào input lỗi (nếu có ref)
  // Nếu không có ref (lỗi không phải do input) → cuộn lên banner lỗi
  const showError = (msg: string, ref?: React.RefObject<HTMLInputElement | null>) => {
    setError(msg);
    setTimeout(() => {
      if (ref?.current) {
        ref.current.focus();
      } else {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // ── Reset lỗi khi đổi role ────────────────────────────────────────────────
  const handleRoleChange = (r: 'candidate' | 'recruiter') => {
    setRole(r);
    setError('');
    setSuccessMsg('');
  };

  // ── Validate chung (trả về true nếu hợp lệ) ──────────────────────────────
  const validate = (): boolean => {
    if (!email.trim()) { showError('Vui lòng nhập email.', emailRef); return false; }
    if (!password) { showError('Vui lòng nhập mật khẩu.', passwordRef); return false; }
    if (password.length < 6) { showError('Mật khẩu phải có ít nhất 6 ký tự.', passwordRef); return false; }
    if (password !== confirmPassword) { showError('Xác nhận mật khẩu không khớp.', confirmPasswordRef); return false; }
    if (role === 'candidate' && !fullName.trim()) { showError('Vui lòng nhập họ và tên.', fullNameRef); return false; }
    if (role === 'recruiter' && !companyName.trim()) { showError('Vui lòng nhập tên công ty.', companyNameRef); return false; }
    if (!agreed) { showError('Bạn cần đồng ý với điều khoản dịch vụ.'); return false; }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      if (role === 'candidate') {
        await registerCandidateApi({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim() || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gender: gender || undefined,
          address: address.trim() || undefined,
        });
      } else {
        await registerRecruiterApi({
          email: email.trim(),
          password,
          companyName: companyName.trim(),
          companyAddress: companyAddress.trim() || undefined,
          companyWebsite: companyWebsite.trim() || undefined,
          companyDescription: companyDescription.trim() || undefined,
        });
      }

      setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      let errMsg = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (axios.isAxiosError(err)) {
        // Lấy thông báo lỗi từ Backend C# gửi về (nếu có)
        // err.response.data chính là giá trị nằm trong return BadRequest(...)
        errMsg = err.response?.data?.message || err.response?.data || 'Đăng ký thất bại từ máy chủ.';
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
      // Cuộn lên banner lỗi để user thấy thông báo
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/60">

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] bg-linear-to-br from-purple-600 via-indigo-600 to-blue-500 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div key={`${row}-${col}`} className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ top: row * 24, right: col * 24 }} />
              ))
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <div key={`${row}-${col}`} className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ bottom: row * 24, left: col * 24 }} />
              ))
            )}
          </div>

          <div className="flex flex-col z-10">
            <div className="text-[32px] font-black tracking-tighter text-white leading-none">
              Up<span className="text-white/70">Work</span>
            </div>
            <span className="text-[11px] text-white/60 font-medium mt-1">Tiếp lợi thế - Nối thành công</span>
          </div>

          <div className="z-10">
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              {role === 'recruiter'
                ? <> Tìm kiếm<br />nhân tài!</>
                : <> Chào mừng bạn<br />đến với UpWork</>}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {role === 'recruiter'
                ? 'Đăng tin tuyển dụng, quản lý hồ sơ ứng viên và xây dựng đội ngũ vững mạnh.'
                : 'Cùng xây dựng hồ sơ nổi bật và nhận cơ hội sự nghiệp lý tưởng dành cho bạn.'}
            </p>
          </div>

          <p className="text-white/40 text-xs z-10">© 2025 UpWork. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white p-8 sm:p-10">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline mb-3">
            <ArrowBigLeft size={15} />Trang chủ
          </button>

          {/* Mobile logo */}
          <div className="flex flex-col mb-6 lg:hidden">
            <div className="text-[26px] font-black tracking-tighter text-gray-800 leading-none">
              Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium mt-0.5">Tiếp lợi thế - Nối thành công</span>
          </div>

          <h1 className="text-2xl font-black text-gray-800 mb-1">Tạo tài khoản</h1>
          <p className="text-sm text-gray-500 mb-6">Bắt đầu hành trình sự nghiệp của bạn ngay hôm nay</p>

          {/* Role Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['candidate', 'recruiter'] as const).map((r) => (
              <button key={r} onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === r
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}>
                {r === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
              </button>
            ))}
          </div>

          {/* Error / Success banner */}
          {error && (
            <div ref={errorBannerRef}
              className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0"><TriangleAlert size={18} className="shrink-0 text-yellow-500" /></span>{error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <span className="shrink-0"><CircleCheck size={18} className="shrink-0 text-green-500" /></span>{successMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* ── Thông tin tài khoản ── */}
            <SectionDivider title="Thông tin tài khoản" />

            {/* Email */}
            <div>
              <label className={labelClass}>Email <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Nhập email" className={inputClass}
                  ref={emailRef}
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Mật khẩu <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" className={inputClass}
                  ref={passwordRef}
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Xác nhận mật khẩu <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" className={inputClass}
                  ref={confirmPasswordRef}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* ── Hồ sơ Ứng viên ── */}
            {role === 'candidate' && (
              <>
                <SectionDivider title="Thông tin cá nhân" />

                {/* FullName */}
                <div>
                  <label className={labelClass}>Họ và tên <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập họ và tên" className={inputClass}
                      ref={fullNameRef}
                      value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="VD: 0912 345 678" className={inputClass}
                      value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* DateOfBirth + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Ngày sinh</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" className={inputClass}
                        value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Giới tính</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select className={inputClass + ' cursor-pointer'} value={gender}
                        onChange={(e) => setGender(e.target.value)} disabled={loading}>
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className={labelClass}>Địa chỉ</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập địa chỉ của bạn" className={inputClass}
                      value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </>
            )}

            {/* ── Hồ sơ Nhà tuyển dụng ── */}
            {role === 'recruiter' && (
              <>
                <SectionDivider title="Thông tin công ty" />

                {/* Company Name */}
                <div>
                  <label className={labelClass}>Tên công ty <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập tên công ty" className={inputClass}
                      ref={companyNameRef}
                      value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <label className={labelClass}>Địa chỉ công ty</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập địa chỉ" className={inputClass}
                      value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Website */}
                <div>
                  <label className={labelClass}>Website công ty</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" placeholder="https://congty.com" className={inputClass}
                      value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label className={labelClass}>Mô tả công ty</label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <textarea rows={3} placeholder="Giới thiệu ngắn về công ty..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none disabled:opacity-60"
                      value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 group-hover:border-indigo-400'}`}>
                {agreed && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span onClick={() => setAgreed(!agreed)} className="text-xs text-gray-500 leading-relaxed">
                Tôi đã đọc và đồng ý với{' '}
                <a href="#" className="text-indigo-600 hover:underline font-semibold">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="#" className="text-indigo-600 hover:underline font-semibold">Chính sách bảo mật</a>
                {' '}của UpWork
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Login redirect */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Bạn đã có tài khoản?{' '}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
