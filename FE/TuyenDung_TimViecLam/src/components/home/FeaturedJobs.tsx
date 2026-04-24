import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Briefcase } from 'lucide-react';
import { getFeaturedJobs } from '../../services/jobService';
import type { Job } from '../../types/job';
import JobCard from '../jobs/JobCard';

const FeaturedJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await getFeaturedJobs();
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

    return (
        <section className="w-full bg-[#f8fafc] py-20 md:py-28 font-sans">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {jobs?.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} />
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
