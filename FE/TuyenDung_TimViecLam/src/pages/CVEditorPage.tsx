import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import {
    Download,
    Plus,
    Trash2,
    Briefcase,
    GraduationCap,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Layout,
    MessageSquare,
    ArrowLeft,
    Image as ImageIcon,
    Sparkles
} from 'lucide-react';

// --- Types ---
interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    duration: string;
}

interface Skill {
    id: string;
    name: string;
    level: number;
}

interface CVData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    gender: string;
    summary: string;
    image: string;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    certificates: string[];
    awards: string[];
}

const CVEditorPage = () => {
    const [cvData, setCvData] = useState<CVData>({
        fullName: 'HỌ TÊN',
        title: 'VỊ TRÍ CÔNG VIỆC BẠN MUỐN ỨNG TUYỂN',
        email: 'vanya@gmail.com',
        phone: '090 123 4567',
        address: 'Hà Nội, Việt Nam',
        birthday: '19/02/1992',
        gender: 'Nữ',
        summary: 'Trở thành một chuyên viên Marketing giỏi trong vòng 3 năm làm việc tại công ty. Sử dụng tiếng Anh thành thạo trong vòng 2 năm để phục vụ tốt cho công việc. Xây dựng cho bản thân sự nghiệp kinh doanh bền vững và phấn đấu trở thành một Quản lý Kinh doanh trong vòng 5 năm tới.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
        experiences: [
            { id: '1', company: 'Tập đoàn cung ứng đồ gia dụng NSKBN', position: 'Quản lý ngành hàng', duration: '2019 - 2020', description: '- Làm việc với nhà cung cấp khi đàm phán hợp đồng và quảng cáo và mua bán\n- Tìm kiếm, phát triển nguồn hàng mới' },
            { id: '2', company: 'Công ty Trách nhiệm hữu hạn Xuất nhập khẩu', position: 'Phó phòng Kinh doanh', duration: '2018 - 2019', description: '- Lập kế hoạch Marketing và phụ trách các chiến lược thúc đẩy doanh số' }
        ],
        education: [
            { id: '1', school: 'Đại học NSK BN Hà Nội', degree: 'Chuyên ngành: Quản trị Marketing', duration: '2015 - 2019' }
        ],
        skills: [
            { id: '1', name: 'Giao tiếp, lắng nghe', level: 80 },
            { id: '2', name: 'Xử lý tình huống', level: 90 },
            { id: '3', name: 'Quản lý thời gian', level: 85 }
        ],
        certificates: ['Chứng chỉ tin học văn phòng trình độ B1', 'Chứng chỉ tiếng Anh giao tiếp'],
        awards: ['Giấy chứng nhận sinh viên tích cực trong phong trào Đoàn trường']
    });

    const cvRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: cvRef,
        documentTitle: `CV_${cvData.fullName.replace(/\s+/g, '_')}`,
    });

    useEffect(() => {
        // Auto resize all textareas on mount
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(ta => {
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
        });
    }, [cvData]); // Also resize when data changes

    const updateField = (field: keyof CVData, value: any) => {
        setCvData(prev => ({ ...prev, [field]: value }));
    };

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { id: Date.now().toString(), company: 'Tên công ty', position: 'Vị trí', duration: 'Thời gian', description: 'Mô tả công việc...' }]
        }));
    };

    const removeExperience = (id: string) => {
        setCvData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
    };

    const addEducation = () => {
        setCvData(prev => ({
            ...prev,
            education: [...prev.education, { id: Date.now().toString(), school: 'Tên trường học', degree: 'Chuyên ngành/Bằng cấp', duration: 'Thời gian' }]
        }));
    };

    const removeEducation = (id: string) => {
        setCvData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
    };

    const addCertificate = () => {
        setCvData(prev => ({ ...prev, certificates: [...prev.certificates, 'Tên chứng chỉ mới'] }));
    };

    const removeCertificate = (index: number) => {
        setCvData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== index) }));
    };

    const addAward = () => {
        setCvData(prev => ({ ...prev, awards: [...prev.awards, 'Tên giải thưởng mới'] }));
    };

    const removeAward = (index: number) => {
        setCvData(prev => ({ ...prev, awards: prev.awards.filter((_, i) => i !== index) }));
    };

    const addSkill = () => {
        setCvData(prev => ({ ...prev, skills: [...prev.skills, { id: Date.now().toString(), name: 'Kỹ năng mới', level: 50 }] }));
    };

    const removeSkill = (id: string) => {
        setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            <Header />

            <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
                {/* Control Bar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row items-center justify-between border border-white/50 sticky top-24 z-30 gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight italic">UpWork <span className="text-indigo-600">CV Direct</span></h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Chế độ chỉnh sửa trực tiếp
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="w-full md:w-auto px-10 py-4 bg-[#00BCD4] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-cyan-500/40 hover:bg-cyan-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Download size={20} /> Xuất File PDF
                    </button>
                </div>

                {/* Direct CV Editor Area */}
                <div className="relative group">
                    <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100 mx-auto w-fit">

                        {/* CV Printable Content */}
                        <div ref={cvRef} className="bg-white text-slate-800 min-h-[1122px] w-[794px] font-sans mx-auto print:m-0 print:shadow-none print:w-full" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>

                            <style>{`
                                @media print {
                                    @page { 
                                        margin: 0.5cm 0; /* Applied to all pages */
                                    }
                                    @page :first {
                                        margin-top: 0; /* No top margin for the first page */
                                    }
                                    body { 
                                        -webkit-print-color-adjust: exact !important; 
                                        print-color-adjust: exact !important; 
                                    }
                                    .print-section { 
                                        page-break-inside: avoid; 
                                        break-inside: avoid; 
                                        margin-bottom: 2rem; 
                                        padding-top: 0.5rem;
                                    }
                                    .no-print { display: none !important; }
                                    input, textarea { border: none !important; padding: 0 !important; background: transparent !important; resize: none !important; }
                                }
                                .cv-input { 
                                    background: transparent; 
                                    border: 1px dashed transparent; 
                                    width: 100%; 
                                    transition: all 0.2s; 
                                    border-radius: 4px;
                                    padding: 2px 4px;
                                }
                                .cv-input:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
                                .cv-input:focus { border-color: #fff; background: rgba(255,255,255,0.1); outline: none; }
                                
                                .cv-input-dark { border-color: transparent; overflow: hidden; resize: none; }
                                .cv-input-dark:hover { border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.02); }
                                .cv-input-dark:focus { border-color: #00BCD4; background: #fff; outline: none; box-shadow: 0 0 0 4px rgba(0,188,212,0.1); }
                            `}</style>

                            {/* Teal Header */}
                            <div className="cv-header bg-[#00BCD4] p-10 text-white relative flex items-center gap-12 overflow-hidden min-h-[300px]">
                                <div className="absolute bottom-0 right-0 w-full h-16 bg-white transform origin-bottom-right -skew-y-3"></div>

                                {/* Avatar */}
                                <div className="relative z-10 shrink-0 group/avatar">
                                    <div className="w-48 h-48 rounded-full border-8 border-white/20 overflow-hidden bg-white shadow-xl relative">
                                        <img src={cvData.image} alt="Avatar" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest no-print pointer-events-none">
                                            <ImageIcon size={24} className="mb-1" /> Thay ảnh
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="absolute -bottom-10 left-0 w-full bg-white text-gray-500 text-[10px] p-2 rounded shadow-lg border border-gray-100 opacity-0 group-hover/avatar:opacity-100 transition-all no-print focus:opacity-100 outline-none"
                                        placeholder="Dán link ảnh vào đây..."
                                        value={cvData.image}
                                        onChange={(e) => updateField('image', e.target.value)}
                                    />
                                </div>

                                {/* Header Info */}
                                <div className="flex-1 relative z-10 pb-6">
                                    <input
                                        className="cv-input text-5xl font-black mb-2 tracking-tighter border-b-2 border-white/30 uppercase"
                                        value={cvData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                    />
                                    <input
                                        className="cv-input text-xl font-bold text-white/90 mb-8 uppercase tracking-widest"
                                        value={cvData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                    />

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] font-bold">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><User size={14} /></div>
                                            <input className="cv-input" value={cvData.gender} onChange={(e) => updateField('gender', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Calendar size={14} /></div>
                                            <input className="cv-input" value={cvData.birthday} onChange={(e) => updateField('birthday', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Phone size={14} /></div>
                                            <input className="cv-input" value={cvData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Mail size={14} /></div>
                                            <input className="cv-input" value={cvData.email} onChange={(e) => updateField('email', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2.5 col-span-2">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><MapPin size={14} /></div>
                                            <input className="cv-input" value={cvData.address} onChange={(e) => updateField('address', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body Grid */}
                            <div className="p-10 pt-8 grid grid-cols-12 gap-12">

                                {/* Left Column */}
                                <div className="col-span-5 space-y-10">
                                    <PrintSection title="MỤC TIÊU NGHỀ NGHIỆP" icon={<Star className="text-[#00BCD4]" size={20} />}>
                                        <textarea
                                            className="cv-input cv-input-dark text-[13px] text-slate-700 leading-relaxed font-medium overflow-hidden resize-none"
                                            value={cvData.summary}
                                            onInput={(e: any) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            onChange={(e) => updateField('summary', e.target.value)}
                                            rows={1}
                                        />
                                    </PrintSection>

                                    <PrintSection title="KỸ NĂNG" icon={<Layout className="text-[#00BCD4]" size={20} />} onAdd={addSkill}>
                                        <div className="space-y-4 pt-2">
                                            {cvData.skills.map((skill, idx) => (
                                                <div key={skill.id} className="group/skill relative">
                                                    <button
                                                        onClick={() => removeSkill(skill.id)}
                                                        className="absolute -left-6 top-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/skill:opacity-100 transition-opacity no-print"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <input
                                                            className="cv-input cv-input-dark text-[12px] font-bold text-slate-800"
                                                            value={skill.name}
                                                            onChange={(e) => {
                                                                const newSkills = [...cvData.skills];
                                                                newSkills[idx].name = e.target.value;
                                                                updateField('skills', newSkills);
                                                            }}
                                                        />
                                                        <input
                                                            type="number"
                                                            className="w-10 text-[10px] font-bold text-gray-400 no-print"
                                                            value={skill.level}
                                                            onChange={(e) => {
                                                                const newSkills = [...cvData.skills];
                                                                newSkills[idx].level = parseInt(e.target.value);
                                                                updateField('skills', newSkills);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#00BCD4]" style={{ width: `${skill.level}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </PrintSection>

                                    <PrintSection title="CHỨNG CHỈ" icon={<MessageSquare className="text-[#00BCD4]" size={20} />} onAdd={addCertificate}>
                                        <div className="space-y-2">
                                            {cvData.certificates.map((cert, i) => (
                                                <div key={i} className="group/cert relative flex items-start gap-2">
                                                    <button
                                                        onClick={() => removeCertificate(i)}
                                                        className="absolute -left-6 top-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/cert:opacity-100 transition-opacity no-print"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                    <span className="text-[13px] font-bold text-slate-700 pt-1.5">-</span>
                                                    <textarea
                                                        className="cv-input cv-input-dark text-[13px] text-slate-700 leading-relaxed font-medium overflow-hidden resize-none"
                                                        value={cert}
                                                        onInput={(e: any) => {
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                        }}
                                                        onChange={(e) => {
                                                            const newCerts = [...cvData.certificates];
                                                            newCerts[i] = e.target.value;
                                                            updateField('certificates', newCerts);
                                                        }}
                                                        rows={1}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </PrintSection>

                                    <PrintSection title="GIẢI THƯỞNG" icon={<Star className="text-[#00BCD4]" size={20} />} onAdd={addAward}>
                                        <div className="space-y-2">
                                            {cvData.awards.map((award, i) => (
                                                <div key={i} className="group/award relative flex items-start gap-2">
                                                    <button
                                                        onClick={() => removeAward(i)}
                                                        className="absolute -left-6 top-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/award:opacity-100 transition-opacity no-print"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                    <span className="text-[13px] font-bold text-slate-700 pt-1.5">-</span>
                                                    <textarea
                                                        className="cv-input cv-input-dark text-[13px] text-slate-700 leading-relaxed font-medium overflow-hidden resize-none"
                                                        value={award}
                                                        onInput={(e: any) => {
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                        }}
                                                        onChange={(e) => {
                                                            const newAwards = [...cvData.awards];
                                                            newAwards[i] = e.target.value;
                                                            updateField('awards', newAwards);
                                                        }}
                                                        rows={1}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </PrintSection>
                                </div>

                                {/* Right Column */}
                                <div className="col-span-7 space-y-10">
                                    <PrintSection title="TRÌNH ĐỘ HỌC VẤN" icon={<GraduationCap className="text-[#00BCD4]" size={20} />} onAdd={addEducation}>
                                        {cvData.education.map((edu, idx) => (
                                            <div key={edu.id} className="mb-6 group/item relative">
                                                <button
                                                    onClick={() => removeEducation(edu.id)}
                                                    className="absolute -left-6 top-0 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity no-print"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <input
                                                    className="cv-input cv-input-dark text-[12px] font-black text-slate-900"
                                                    value={edu.duration}
                                                    onChange={(e) => {
                                                        const newEdu = [...cvData.education];
                                                        newEdu[idx].duration = e.target.value;
                                                        updateField('education', newEdu);
                                                    }}
                                                />
                                                <input
                                                    className="cv-input cv-input-dark text-[15px] font-black text-slate-900 mt-1 uppercase"
                                                    value={edu.school}
                                                    onChange={(e) => {
                                                        const newEdu = [...cvData.education];
                                                        newEdu[idx].school = e.target.value;
                                                        updateField('education', newEdu);
                                                    }}
                                                />
                                                <input
                                                    className="cv-input cv-input-dark text-[13px] font-bold text-slate-600"
                                                    value={edu.degree}
                                                    onChange={(e) => {
                                                        const newEdu = [...cvData.education];
                                                        newEdu[idx].degree = e.target.value;
                                                        updateField('education', newEdu);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </PrintSection>

                                    <PrintSection
                                        title="KINH NGHIỆM LÀM VIỆC"
                                        icon={<Briefcase className="text-[#00BCD4]" size={20} />}
                                        onAdd={addExperience}
                                    >
                                        {cvData.experiences.map((exp, idx) => (
                                            <div key={exp.id} className="mb-8 relative pl-2 group/exp">
                                                <button
                                                    onClick={() => removeExperience(exp.id)}
                                                    className="absolute -left-6 top-0 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/exp:opacity-100 transition-opacity no-print"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <input
                                                    className="cv-input cv-input-dark text-[12px] font-black text-slate-900"
                                                    value={exp.duration}
                                                    onChange={(e) => {
                                                        const newExps = [...cvData.experiences];
                                                        newExps[idx].duration = e.target.value;
                                                        updateField('experiences', newExps);
                                                    }}
                                                />
                                                <input
                                                    className="cv-input cv-input-dark text-[15px] font-black text-slate-900 mt-1 uppercase"
                                                    value={exp.company}
                                                    onChange={(e) => {
                                                        const newExps = [...cvData.experiences];
                                                        newExps[idx].company = e.target.value;
                                                        updateField('experiences', newExps);
                                                    }}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-black text-indigo-600 whitespace-nowrap">Vị trí:</span>
                                                    <input
                                                        className="cv-input cv-input-dark text-[13px] font-black text-indigo-600"
                                                        value={exp.position}
                                                        onChange={(e) => {
                                                            const newExps = [...cvData.experiences];
                                                            newExps[idx].position = e.target.value;
                                                            updateField('experiences', newExps);
                                                        }}
                                                    />
                                                </div>
                                                <textarea
                                                    className="cv-input cv-input-dark text-[13px] text-slate-600 leading-relaxed font-medium mt-2 overflow-hidden resize-none"
                                                    value={exp.description}
                                                    onInput={(e: any) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                    }}
                                                    onChange={(e) => {
                                                        const newExps = [...cvData.experiences];
                                                        newExps[idx].description = e.target.value;
                                                        updateField('experiences', newExps);
                                                    }}
                                                    rows={1}
                                                />
                                            </div>
                                        ))}
                                    </PrintSection>
                                </div>

                            </div>

                            {/* Footer Link */}
                            <div className="absolute bottom-6 right-10 text-[10px] font-bold text-slate-300">
                                upwork.com
                            </div>
                        </div>
                    </div>

                    {/* Quick Guide Overlay (Fade out) */}
                    <div className="absolute top-10 -left-64 w-56 bg-white p-6 rounded-3xl shadow-xl border border-indigo-100 hidden xl:block animate-bounce-slow">
                        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-3">
                            <Sparkles size={16} /> Tip
                        </div>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">
                            Click trực tiếp vào bất kỳ văn bản nào trên CV để chỉnh sửa!
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

// --- Sub-components ---

const PrintSection = ({ title, icon, children, onAdd }: { title: string, icon: React.ReactNode, children: React.ReactNode, onAdd?: () => void }) => (
    <section className="print-section">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    {icon}
                </div>
                <h2 className="text-[14px] font-black text-slate-900 tracking-tight">{title}</h2>
            </div>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all no-print"
                >
                    <Plus size={16} />
                </button>
            )}
        </div>
        <div className="px-1">
            {children}
        </div>
    </section>
);

export default CVEditorPage;
