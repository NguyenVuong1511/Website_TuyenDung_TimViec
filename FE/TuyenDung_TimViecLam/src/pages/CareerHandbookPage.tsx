import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { Search, Tag, Clock, ChevronRight, BookOpen, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../services/articleService';
import type { Article } from '../services/articleService';

const CareerHandbookPage = () => {
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = ['Tất cả', 'Bí quyết xin việc', 'Kỹ năng phỏng vấn', 'Phát triển bản thân', 'Xu hướng nghề nghiệp'];

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            const res = await getAllArticles(activeCategory);
            if (res.success) {
                setArticles(res.data);
                setError(null);
            } else {
                setError(res.message);
            }
            setLoading(false);
        };

        fetchArticles();
    }, [activeCategory]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Section */}
                <div className="bg-slate-900 pt-24 pb-48 px-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
                                <Sparkles size={14} />
                                Tri thức là sức mạnh
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
                                Cẩm nang <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-blue-400">Nghề nghiệp</span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-12">
                                Tổng hợp những bài viết chuyên sâu, bí quyết xin việc và xu hướng thị trường giúp bạn bứt phá trong sự nghiệp.
                            </p>

                            {/* Search Bar */}
                            <div className="w-full max-w-2xl relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết, chủ đề..."
                                    className="w-full pl-16 pr-8 py-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-[32px] text-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/15 transition-all outline-none"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                                    Tìm ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-[1200px] mx-auto px-4 -mt-24 relative z-20">

                    {loading ? (
                        <div className="min-h-[400px] bg-white rounded-[40px] flex flex-col items-center justify-center shadow-xl border border-gray-100">
                            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-bold">Đang tải kiến thức...</p>
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            {/* Featured Article */}
                            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 mb-20 group border border-gray-100 flex flex-col lg:flex-row min-h-[450px]">
                                <div className="lg:w-1/2 overflow-hidden h-[300px] lg:h-auto">
                                    <img
                                        src={articles[0].image}
                                        alt="Featured"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                            Nổi bật
                                        </span>
                                        <span className="text-gray-400 text-sm font-bold flex items-center gap-1">
                                            <Clock size={14} /> {articles[0].readTime} đọc
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {articles[0].title}
                                    </h2>
                                    <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium line-clamp-3">
                                        {articles[0].excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center font-black text-indigo-600">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900">Ban biên tập</div>
                                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(articles[0].createdAt).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                        </div>
                                        <Link to={`/handbook/${articles[0].id}`} className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                                            <ChevronRight size={24} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {/* Filter & Listing */}
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-600'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest">
                                <TrendingUp size={16} className="text-indigo-500" />
                                Mới nhất
                            </div>
                        </div>

                        {/* Article Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {!loading && articles.length > 0 && articles.slice(1).map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>

                        {!loading && articles.length === 0 && !error && (
                            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
                                <p className="text-gray-400 font-bold">Chưa có bài viết nào trong chuyên mục này.</p>
                            </div>
                        )}

                        {/* Load More */}
                        <div className="flex justify-center mt-12">
                            <button className="px-10 py-5 bg-white border border-gray-200 text-gray-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 hover:border-indigo-600 transition-all shadow-sm active:scale-95">
                                Xem thêm bài viết
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const ArticleCard = ({ article }: any) => (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col h-full">
        <div className="h-[240px] overflow-hidden relative">
            <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {article.category}
                </span>
            </div>
        </div>
        <div className="p-8 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} đọc</span>
                <span>•</span>
                <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                {article.title}
            </h3>
            <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                {article.excerpt}
            </p>
            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-indigo-600">
                        <Tag size={12} />
                    </div>
                    <span className="text-xs font-black text-gray-700">Tri thức</span>
                </div>
                <Link to={`/handbook/${article.id}`} className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    Xem chi tiết <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    </div>
);

export default CareerHandbookPage;
