import {
    Code2,
    Megaphone,
    Palette,
    CircleDollarSign,
    HeartPulse,
    GraduationCap,
    PenTool,
    LineChart,
    Scale,
    Users,
    Camera,
    Globe2,
    ArrowRight
} from 'lucide-react';

const categories = [
    {
        id: 1,
        title: "IT & Phần mềm",
        jobs: "+320",
        icon: Code2,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        id: 2,
        title: "Marketing",
        jobs: "+154",
        icon: Megaphone,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
    },
    {
        id: 3,
        title: "Thiết kế & Sáng tạo",
        jobs: "+211",
        icon: Palette,
        color: "text-pink-600",
        bgColor: "bg-pink-50"
    },
    {
        id: 4,
        title: "Tài chính & Ngân hàng",
        jobs: "+183",
        icon: CircleDollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50"
    },
    {
        id: 5,
        title: "Y tế & Sức khỏe",
        jobs: "+127",
        icon: HeartPulse,
        color: "text-red-500",
        bgColor: "bg-red-50"
    },
    {
        id: 6,
        title: "Giáo dục & Đào tạo",
        jobs: "+94",
        icon: GraduationCap,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
    },
    {
        id: 7,
        title: "Kỹ thuật cơ khí",
        jobs: "+256",
        icon: PenTool,
        color: "text-slate-600",
        bgColor: "bg-slate-100"
    },
    {
        id: 8,
        title: "Kinh doanh & Bán hàng",
        jobs: "+168",
        icon: LineChart,
        color: "text-orange-500",
        bgColor: "bg-orange-50"
    },
    {
        id: 9,
        title: "Pháp lý",
        jobs: "+72",
        icon: Scale,
        color: "text-gray-600",
        bgColor: "bg-gray-100"
    },
    {
        id: 10,
        title: "Nhân sự & Tuyển dụng",
        jobs: "+89",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50"
    },
    {
        id: 11,
        title: "Truyền thông & Media",
        jobs: "+113",
        icon: Camera,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50"
    },
    {
        id: 12,
        title: "Làm việc từ xa",
        jobs: "+445",
        icon: Globe2,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
    }
];

const JobCategories = () => {
    return (
        <section className="w-full bg-white py-10 md:py-16 font-sans">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">
                            TÌM KIẾM THEO NGÀNH NGHỀ
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-display text-gray-900 mb-3">
                            Ngành Nghề Phổ Biến
                        </h2>
                        <p className="text-gray-500">
                            Khám phá cơ hội việc làm ở các ngành nghề được săn đón nhất
                        </p>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all outline-none cursor-pointer">
                            Xem tất cả danh mục
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-xl p-5 flex items-center gap-4 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${category.bgColor} ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon size={24} strokeWidth={1.5} />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                    {category.title}
                                </span>
                                <span className="text-[13px] text-gray-500 font-medium tracking-tight mt-0.5">
                                    {category.jobs} việc làm
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default JobCategories;
