import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import {
  User, Lock, Bell, LogOut, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import { getUserId, getUserRole, getAccountInfoApi, changePasswordApi, updateCandidateProfileApi, updateRecruiterProfileApi, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import type { AccountInfo } from '../types/auth';

const SettingsPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const role = getUserRole()?.toUpperCase();

  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    address: '',
    companyName: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAccountInfoApi(userId);
        if (res.success) {
          setAccountInfo(res.data);
          setProfileData({
            fullName: res.data.fullName || '',
            phone: res.data.phone || '',
            address: '', // Could fetch from candidate details if needed
            companyName: res.data.companyName || '',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage(null);
    try {
      let res;
      if (role === 'CANDIDATE') {
        res = await updateCandidateProfileApi({
          userId,
          fullName: profileData.fullName,
          phone: profileData.phone,
        });
      } else {
        res = await updateRecruiterProfileApi({
          userId,
          companyName: profileData.companyName,
        });
      }

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Cập nhật thất bại' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await changePasswordApi({
        userId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col py-10">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black font-display text-gray-900 tracking-tight">
              Cài đặt <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">Tài khoản</span>
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">Quản lý thông tin cá nhân, bảo mật và các tùy chọn hồ sơ của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Sidebar Navigation */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-2">
              <button
                onClick={() => { setActiveTab('account'); setMessage(null); }}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'account'
                  ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <User size={18} className={activeTab === 'account' ? 'text-indigo-500' : 'text-gray-400'} />
                Tài khoản cá nhân
              </button>

              <button
                onClick={() => { setActiveTab('security'); setMessage(null); }}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'security'
                  ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <Lock size={18} className={activeTab === 'security' ? 'text-indigo-500' : 'text-gray-400'} />
                Bảo mật & Mật khẩu
              </button>

              <button
                onClick={() => { setActiveTab('notifications'); setMessage(null); }}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'notifications'
                  ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <Bell size={18} className={activeTab === 'notifications' ? 'text-indigo-500' : 'text-gray-400'} />
                Cài đặt thông báo
              </button>

              <div className="h-px bg-gray-200 my-2"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 min-h-[500px]">

                {message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{message.text}</span>
                  </div>
                )}

                {activeTab === 'account' && (
                  <form onSubmit={handleProfileUpdate} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-blue-500 rounded-full"></div>
                      Thông tin cơ bản
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-sm font-bold text-gray-700">Email (Không thể thay đổi tại đây)</label>
                          <input
                            type="email"
                            value={accountInfo?.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 outline-none"
                          />
                        </div>

                        {role === 'CANDIDATE' ? (
                          <>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-sm font-bold text-gray-700">Họ và Tên</label>
                              <input
                                type="text"
                                value={profileData.fullName}
                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                              <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Tên công ty</label>
                            <input
                              type="text"
                              value={profileData.companyName}
                              onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5 md:col-span-2 mt-4">
                          <button
                            disabled={saving}
                            className="bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-3.5 px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto self-end transition-all"
                          >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    </div>

                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-2 h-6 bg-linear-to-b from-blue-500 to-teal-500 rounded-full"></div>
                      Đổi mật khẩu
                    </h2>

                    <div className="flex flex-col gap-5 max-w-md">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          required
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Mật khẩu mới</label>
                        <input
                          type="password"
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          disabled={saving}
                          className="bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer w-full transition-all"
                        >
                          {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {(activeTab === 'notifications') && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Bell size={24} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-center max-w-sm">
                      Tính năng này đang trong quá trình phát triển và sẽ sớm được cập nhật.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
