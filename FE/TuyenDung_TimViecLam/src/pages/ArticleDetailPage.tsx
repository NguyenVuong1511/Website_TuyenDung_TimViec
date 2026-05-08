import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getArticleById } from '../services/articleService';
import type { Article } from '../services/articleService';
import { Clock, Calendar, ChevronLeft, Share2, MessageSquare, Loader2, BookOpen, Link2 } from 'lucide-react';

const ArticleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setLoading(true);
            const res = await getArticleById(id);
            if (res.success) {
                setArticle(res.data);
            } else {
                setError(res.message);
            }
            setLoading(false);
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-20">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold">Đang tải bài viết...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy bài viết</h2>
                    <p className="text-gray-500 mb-8 max-w-md">{error || 'Bài viết bạn yêu cầu không tồn tại hoặc đã bị xóa.'}</p>
                    <Link to="/handbook" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                        Quay lại cẩm nang
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Section */}
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className="max-w-[1000px] mx-auto">
                            <Link to="/handbook" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white font-black text-xs uppercase tracking-widest mb-6 transition-colors">
                                <ChevronLeft size={16} /> Quay lại cẩm nang
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {article.category}
                                </span>
                                <div className="flex items-center gap-4 text-gray-300 text-sm font-bold">
                                    <span className="flex items-center gap-1.5"><Clock size={16} /> {article.readTime} đọc</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                                {article.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-12 md:mt-16">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Main Content */}
                        <div className="lg:w-full">
                            {/* Excerpt */}
                            <div className="text-xl md:text-2xl font-bold text-gray-600 leading-relaxed mb-12 border-l-4 border-indigo-600 pl-6 italic bg-slate-50 py-8 rounded-r-3xl">
                                {article.excerpt}
                            </div>

                            {/* Body */}
                            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-loose prose-img:rounded-[32px] prose-img:shadow-2xl">
                                {article.content.split('\n').map((para, index) => (
                                    para.trim() ? <p key={index} className="mb-6">{para}</p> : <br key={index} />
                                ))}
                            </div>

                            {/* Footer / Share */}
                            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900">Ban biên tập UpWork</div>
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tri thức bứt phá sự nghiệp</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-400 hover:text-white transition-all shadow-sm">
                                        <MessageSquare size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all shadow-sm">
                                        <Link2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ArticleDetailPage;
