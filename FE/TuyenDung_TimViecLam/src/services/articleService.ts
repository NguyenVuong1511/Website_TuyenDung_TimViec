import axiosInstance from './axiosInstance';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    readTime: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

export const getAllArticles = async (category?: string) => {
    try {
        const url = category && category !== 'Tất cả'
            ? `/articles?category=${encodeURIComponent(category)}`
            : '/articles';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Không thể tải danh sách bài viết'
        };
    }
};

export const getArticleById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/articles/${id}`);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Không thể tải nội dung bài viết'
        };
    }
};
