import { Heart, MapPin, ArrowRight } from 'lucide-react';

const featuredJobs = [
    {
        id: 1,
        company: "Tech Corp Inc.",
        logo: "TC",
        logoBg: "bg-blue-600",
        time: "2 ngày trước",
        title: "Senior React Developer",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Từ xa",
        workModeColor: "text-purple-600 bg-purple-50",
        location: "Hồ Chí Minh",
        salary: "$1,200 - $2,000",
    },
    {
        id: 2,
        company: "DesignHub Co.",
        logo: "DH",
        logoBg: "bg-pink-500",
        time: "1 ngày trước",
        title: "Senior Product Designer",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Linh hoạt",
        workModeColor: "text-orange-600 bg-orange-50",
        location: "Hà Nội",
        salary: "$1,000 - $1,500",
    },
    {
        id: 3,
        company: "BrandCo Ltd.",
        logo: "BC",
        logoBg: "bg-orange-500",
        time: "3 ngày trước",
        title: "Marketing Manager",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Tại văn phòng",
        workModeColor: "text-green-600 bg-green-50",
        location: "Đà Nẵng",
        salary: "$800 - $1,200",
    },
    {
        id: 4,
        company: "DataFlow AI",
        logo: "DF",
        logoBg: "bg-teal-600",
        time: "5 giờ trước",
        title: "Data Scientist",
        type: "Từ xa",
        typeColor: "text-purple-600 bg-purple-50",
        workMode: "Hợp đồng",
        workModeColor: "text-yellow-600 bg-yellow-50",
        location: "Hà Nội",
        salary: "$1,500 - $2,500",
    },
    {
        id: 5,
        company: "CloudSys AG",
        logo: "CS",
        logoBg: "bg-indigo-600",
        time: "1 ngày trước",
        title: "Backend Engineer (Node.js)",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Từ xa",
        workModeColor: "text-purple-600 bg-purple-50",
        location: "Hồ Chí Minh",
        salary: "$1,300 - $2,200",
    },
    {
        id: 6,
        company: "UserFirst Labs",
        logo: "UF",
        logoBg: "bg-cyan-600",
        time: "4 ngày trước",
        title: "UX Researcher",
        type: "Bán thời gian",
        typeColor: "text-emerald-600 bg-emerald-50",
        workMode: "Từ xa",
        workModeColor: "text-purple-600 bg-purple-50",
        location: "Đà Nẵng",
        salary: "$600 - $900",
    },
    {
        id: 7,
        company: "InfraCloud",
        logo: "IC",
        logoBg: "bg-amber-500",
        time: "Vừa xong",
        title: "DevOps Engineer",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Linh hoạt",
        workModeColor: "text-orange-600 bg-orange-50",
        location: "Hồ Chí Minh",
        salary: "$1,400 - $2,400",
    },
    {
        id: 8,
        company: "GlobalBank PLC",
        logo: "GB",
        logoBg: "bg-slate-800",
        time: "6 ngày trước",
        title: "Financial Analyst",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Tại văn phòng",
        workModeColor: "text-green-600 bg-green-50",
        location: "Hà Nội",
        salary: "$1,000 - $1,800",
    },
    {
        id: 9,
        company: "MediaWave",
        logo: "MW",
        logoBg: "bg-rose-600",
        time: "2 ngày trước",
        title: "Content Strategist",
        type: "Toàn thời gian",
        typeColor: "text-blue-600 bg-blue-50",
        workMode: "Từ xa",
        workModeColor: "text-purple-600 bg-purple-50",
        location: "Làm việc từ xa",
        salary: "$700 - $1,100",
    }
];

const FeaturedJobs = () => {
    return (
        <section className="w-full bg-white py-16 md:py-24 font-sans border-t border-gray-100">
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
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all outline-none cursor-pointer">
                            Xem tất cả việc làm
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map((job) => (
                        <div 
                            key={job.id} 
                            className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col group"
                        >
                            {/* Top Info: Logo, Company, Heart */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${job.logoBg}`}>
                                        {job.logo}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-[15px]">{job.company}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{job.time}</p>
                                    </div>
                                </div>
                                <button className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer">
                                    <Heart size={20} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Job Title */}
                            <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                {job.title}
                            </h4>

                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${job.typeColor}`}>
                                    {job.type}
                                </span>
                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${job.workModeColor}`}>
                                    {job.workMode}
                                </span>
                            </div>

                            {/* Bottom Info: Location & Salary */}
                            <div className="flex justify-between items-center mb-5 mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <MapPin size={16} />
                                    <span className="text-[13px] font-medium">{job.location}</span>
                                </div>
                                <span className="text-[14px] font-bold text-emerald-600">
                                    {job.salary}
                                </span>
                            </div>

                            {/* Apply Button */}
                            <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                Ứng tuyển ngay
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedJobs;
