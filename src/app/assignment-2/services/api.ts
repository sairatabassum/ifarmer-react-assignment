// services/apiClient.ts
import axios from 'axios';
import { Product } from '../types/product';
import { ProductFormData } from '../types/productForm';

const apiClient = axios.create({
    baseURL: 'https://api.escuelajs.co/api/v1',
});

export const getProducts = async (params: { page?: number; search?: string; category?: string } = {}) => {
    const { page = 1, search, category } = params;
    const offset = (page - 1) * 12;

    let url = `/products?offset=${offset}&limit=12`;
    if (search) url += `&title=${encodeURIComponent(search)}`;
    if (category) url += `&categoryId=${category}`;

    const response = await apiClient.get(url);
    // your pagination logic here, e.g.
    const total = response.data.length < 12 ? offset + response.data.length : offset + 12 + 1;

    return { products: response.data, total };
};

export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data;
};


export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  };

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  };