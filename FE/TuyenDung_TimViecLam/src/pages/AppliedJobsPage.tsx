import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getMyApplicationsApi, type JobApplication } from '../services/applicationService';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, Calendar, Clock, ChevronRight,
  Search, Loader2, AlertCircle,
  CheckCircle2, XCircle, Timer, Info, FileUp, UserCircle2
} from 'lucide-react';
import { format } from 'date-fns';

const AppliedJobsPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await getMyApplicationsApi(userId);
        if (res.success) {
          setApplications(res.data);
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách ứng tuyển');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
            <Timer size={14} />
            Đang chờ duyệt
          </span>
        );
      case 'reviewed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
            <Search size={14} />
            Đã xem hồ sơ
          </span>
        );
      case 'interviewing':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100">
            <Calendar size={14} />
            Hẹn phỏng vấn
          </span>
        );
      case 'hired':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
            <CheckCircle2 size={14} />
            Trúng tuyển
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
            <XCircle size={14} />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black font-display text-gray-900 tracking-tight">
              Việc làm <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-blue-500">Đã ứng tuyển</span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg font-medium">Theo dõi trạng thái và phản hồi từ các nhà tuyển dụng.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-bold">Đang tải danh sách...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-red-50">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Thử lại
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Briefcase size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Bạn chưa ứng tuyển công việc nào</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Hãy khám phá hàng ngàn cơ hội việc làm hấp dẫn đang chờ đón bạn.</p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Tìm việc ngay
                <ChevronRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Company Logo */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0">
                      <img
                        src={app.companyLogo ? `/images/${app.companyLogo}` : 'https://placehold.co/100x100?text=Logo'}
                        alt={app.companyName}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Logo'; }}
                      />
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {getStatusBadge(app.status || 'Pending')}
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <Clock size={14} />
                          Nộp ngày: {format(new Date(app.applyDate || ''), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                        {app.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 font-bold">
                        <span>{app.companyName}</span>
                      </div>
                    </div>

                    {/* Actions & Detail */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-right hidden md:block mr-4">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Loại hồ sơ</div>
                        <div className={`text-sm font-black flex items-center justify-end gap-1 ${app.cvType === 'File' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                          {app.cvType === 'File' ? (
                            <>
                              <FileUp size={14} />
                              CV Tải lên
                            </>
                          ) : (
                            <>
                              <UserCircle2 size={14} />
                              CV Online
                            </>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/jobs/${app.jobPostId}`}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-gray-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        Chi tiết việc làm
                      </Link>
                    </div>
                  </div>

                  {/* Employer Note if exists */}
                  {app.employerNote && (
                    <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Info size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-1">Phản hồi từ nhà tuyển dụng</div>
                        <p className="text-indigo-900/80 font-medium text-sm leading-relaxed">{app.employerNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppliedJobsPage;
