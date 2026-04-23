import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Loader2, Briefcase, DollarSign, Clock } from 'lucide-react';
import { getFeaturedJobs } from '../../services/jobService';
import type { Job } from '../../types/job';

const FeaturedJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await getFeaturedJobs();
                // API top jobs trả về data là mảng [Job] trực tiếp
                if (response.success && Array.isArray(response.data)) {
                    setJobs(response.data);
                } else {
                    setJobs([]);
                    if (!response.success) setError(response.message);
                }
            } catch (err: any) {
                setError(err.message || 'Không thể tải danh sách công việc');
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return "Thỏa thuận";
        const formatValue = (val: number) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(0)}tr`;
            return val.toLocaleString('vi-VN');
        };
        return `${formatValue(min)} - ${formatValue(max)}`;
    };

    const formatTimeAgo = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Vừa xong";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} ngày`;
        return date.toLocaleDateString('vi-VN');
    };

    const getLogoUrl = (logo: string) => {
        if (!logo) return null;
        if (logo.startsWith('http')) return logo;
        return `/images/${logo}`;
    };

    const handleImageError = (jobId: string) => {
        setFailedImages(prev => ({ ...prev, [jobId]: true }));
    };

    const getLogoPlaceholder = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    };

    const bgColors = [
        'bg-blue-600', 'bg-emerald-500', 'bg-orange-500',
        'bg-indigo-600', 'bg-rose-500', 'bg-amber-500',
        'bg-violet-600', 'bg-cyan-600', 'bg-slate-800'
    ];

    return (
        <section className="w-full bg-[#f8fafc] py-20 md:py-28 font-sans">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">
                            CÔNG VIỆC CHỌN LỌC
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-display text-gray-900 mb-3">
                            Việc Làm Nổi Bật
                        </h2>
                        <p className="text-gray-500">
                            Các vị trí hấp dẫn từ những đối tác hàng đầu của chúng tôi
                        </p>
                    </div>
                    <div>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all group"
                        >
                            Xem tất cả việc làm
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <Loader2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="mt-6 text-gray-400 font-medium animate-pulse">Đang tìm kiếm những cơ hội tốt nhất...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase size={32} />
                        </div>
                        <p className="text-red-600 text-lg font-bold mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all cursor-pointer"
                        >
                            Thử lại ngay
                        </button>
                    </div>
                ) : (jobs?.length === 0) ? (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Briefcase size={48} className="mx-auto text-gray-300 mb-6" />
                        <p className="text-gray-500 text-xl font-medium">Hiện chưa có tin tuyển dụng nào phù hợp.</p>
                        <p className="text-gray-400 mt-2">Vui lòng quay lại sau hoặc xem các danh mục khác.</p>
                    </div>
                ) : (
                    /* Jobs Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs?.map((job, index) => (
                            <div
                                key={job.id}
                                className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col"
                            >
                                {/* Top: Logo & Meta */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            {job.companyLogo && !failedImages[job.id] ? (
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                                                    <img
                                                        src={getLogoUrl(job.companyLogo) || ''}
                                                        alt={job.companyName}
                                                        className="w-full h-full object-contain"
                                                        onError={() => handleImageError(job.id)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner ${bgColors[index % bgColors.length]}`}>
                                                    {getLogoPlaceholder(job.companyName)}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-[16px] line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {job.companyName}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                                                <Clock size={12} />
                                                <span>{formatTimeAgo(job.postDate)} trước</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer">
                                        <Heart size={20} strokeWidth={2} />
                                    </button>
                                </div>

                                {/* Title */}
                                <Link to={`/jobs/${job.id}`} className="block mb-4">
                                    <h4 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[56px]">
                                        {job.title}
                                    </h4>
                                </Link>

                                {/* Tags */}
                                <div className="flex flex-wrap items-center gap-2 mb-8">
                                    <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center gap-1.5 border border-blue-100">
                                        <Briefcase size={12} />
                                        {job.jobTypeName}
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-bold border border-orange-100">
                                        Linh hoạt
                                    </div>
                                </div>

                                {/* Footer: Location & Salary */}
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                            <MapPin size={16} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm font-semibold">{job.locationName}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Mức lương</div>
                                        <div className="text-[16px] font-black text-emerald-600 flex items-center gap-1">
                                            <DollarSign size={14} />
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Action Overlay - Only visible on hover or mobile */}
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="mt-6 w-full py-4 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 hover:shadow-indigo-500/30 transition-all duration-300"
                                >
                                    Ứng tuyển ngay
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {!loading && !error && jobs?.length > 0 && (
                    <div className="mt-16 text-center">
                        <p className="text-gray-500 mb-6">Bạn chưa tìm thấy công việc ưng ý? Hãy xem thêm hàng ngàn cơ hội khác.</p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all group"
                        >
                            Khám phá tất cả việc làm
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
};

export default FeaturedJobs;
