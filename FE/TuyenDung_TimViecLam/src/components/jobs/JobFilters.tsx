import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ChevronDown, Filter, X } from 'lucide-react';
import { getCategories } from '../../services/categoriesService';
import type { Category } from '../../types/categories';

interface JobFiltersProps {
    onFilterChange: (filters: any) => void;
}

const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState({
        title: '',
        categoryId: '',
        locationId: '',
        jobTypeId: '',
        levelId: '',
        experienceId: '',
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.title, onFilterChange]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        
        // For selects and radios, trigger immediately
        if (name !== 'title') {
            onFilterChange(newFilters);
        }
    };

    const clearFilters = () => {
        const resetFilters = {
            title: '',
            categoryId: '',
            locationId: '',
            jobTypeId: '',
            levelId: '',
            experienceId: '',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    // Hardcoded for now as placeholders
    const locations = [
        { id: '1', name: 'Hồ Chí Minh' },
        { id: '2', name: 'Hà Nội' },
        { id: '3', name: 'Đà Nẵng' },
        { id: '4', name: 'Cần Thơ' },
    ];

    const jobTypes = [
        { id: '1', name: 'Toàn thời gian' },
        { id: '2', name: 'Bán thời gian' },
        { id: '3', name: 'Thực tập' },
        { id: '4', name: 'Freelance' },
    ];

    const experienceLevels = [
        { id: '1', name: 'Chưa có kinh nghiệm' },
        { id: '2', name: 'Dưới 1 năm' },
        { id: '3', name: '1-3 năm' },
        { id: '4', name: 'Trên 3 năm' },
    ];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-indigo-600" />
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Bộ lọc</h3>
                </div>
                <button 
                    onClick={clearFilters}
                    className="text-xs font-bold text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                    <X size={14} />
                    Xóa tất cả
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Tìm kiếm theo tên
                </label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        name="title"
                        value={filters.title}
                        onChange={handleChange}
                        placeholder="Vị trí, tên công ty..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Ngành nghề
                </label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium appearance-none"
                    >
                        <option value="">Tất cả ngành nghề</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Địa điểm
                </label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        name="locationId"
                        value={filters.locationId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium appearance-none"
                    >
                        <option value="">Toàn quốc</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Job Type Filter */}
            <div className="mb-6">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Hình thức
                </label>
                <div className="space-y-3">
                    {jobTypes.map(type => (
                        <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="jobTypeId"
                                value={type.id}
                                checked={filters.jobTypeId === type.id}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-2 border-gray-200 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
                                {type.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience Level Filter */}
            <div className="mb-8">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Kinh nghiệm
                </label>
                <div className="space-y-3">
                    {experienceLevels.map(exp => (
                        <label key={exp.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="experienceId"
                                value={exp.id}
                                checked={filters.experienceId === exp.id}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-2 border-gray-200 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
                                {exp.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onFilterChange(filters)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-lg shadow-gray-900/10 hover:shadow-indigo-500/30 transition-all"
            >
                Áp dụng lọc
            </button>
        </div>
    );
};

export default JobFilters;
