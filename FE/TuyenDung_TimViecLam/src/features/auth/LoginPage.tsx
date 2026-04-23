import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowBigLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginApi, getToken, clearAuthData } from '../../services/authService';
import { isTokenExpired } from '../../utils/jwt';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // Refs để focus vào ô input lỗi
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  // Helper: hiện lỗi + focus vào input lỗi
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phía client
    if (!email.trim()) return showError('Vui lòng nhập email.', emailRef);
    if (!password) return showError('Vui lòng nhập mật khẩu.', passwordRef);

    setLoading(true);
    try {
      const user = await loginApi({ email: email.trim(), password }, remember);

      // Điều hướng theo role
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/60">

        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] bg-linear-to-br from-purple-600 via-indigo-600 to-blue-500 p-10 relative overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ top: row * 24, right: col * 24 }}
                />
              ))
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ bottom: row * 24, left: col * 24 }}
                />
              ))
            )}
          </div>

          {/* Logo */}
          <div className="flex flex-col z-10">
            <div className="text-[32px] font-black tracking-tighter text-white leading-none">
              Up<span className="text-white/70">Work</span>
            </div>
            <span className="text-[11px] text-white/60 font-medium mt-1">
              Tiếp lợi thế - Nối thành công
            </span>
          </div>

          {/* Center content */}
          <div className="z-10">
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              Chào mừng<br />trở lại!
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Đăng nhập để tiếp tục hành trình sự nghiệp của bạn và khám phá hàng nghìn cơ hội việc làm hấp dẫn.
            </p>
          </div>

          {/* Bottom */}
          <p className="text-white/40 text-xs z-10">© 2025 UpWork. All rights reserved.</p>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-8 sm:p-10">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline mb-3">
            <ArrowBigLeft size={15} />Trang chủ
          </button>

          {/* Mobile Logo */}
          <div className="flex flex-col mb-6 lg:hidden">
            <div className="text-[26px] font-black tracking-tighter text-gray-800 leading-none">
              Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium mt-0.5">Tiếp lợi thế - Nối thành công</span>
          </div>

          <h1 className="text-2xl font-black text-gray-800 mb-1">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mb-8">Chào mừng bạn quay trở lại UpWork</p>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Mật khẩu</label>
                <a href="#" className="text-xs text-indigo-600 font-semibold hover:underline">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${remember ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                  }`}
              >
                {remember && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span onClick={() => setRemember(!remember)} className="text-xs text-gray-500">Ghi nhớ đăng nhập</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Register redirect */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-indigo-600 font-semibold hover:underline">Đăng ký ngay</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
