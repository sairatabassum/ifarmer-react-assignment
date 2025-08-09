'use client'

import { Search } from 'iconoir-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Category, Product } from '../types/product';
import { getCategories,getProducts } from '../services/api';
import { ProductCard } from '../../../components/product/ProductCard';
import { DeleteConfirmationModal } from '../../../components/product/ProductDeleteModal';

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const Pagination = ({ total, limit, currentPage, onPageChange }: {
    total: number;
    limit: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) => {
    const totalPages = Math.ceil(total / limit);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl shadow-md w-full">
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-lg bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                    &lt;
                </button>
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-3 rounded-lg transition-colors font-semibold ${page === currentPage
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-white hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-3 rounded-lg bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};
  

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { products: fetchedProducts, total } = await getProducts({
                page: currentPage,
                search: searchTerm,
                category: selectedCategory || undefined,
            });
            setProducts(fetchedProducts);
            setTotalProducts(total);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
        }, 500),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(prevCat => prevCat === categoryId ? null : categoryId);
        setCurrentPage(1); 
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (product: Product) => {
        setShowDeleteModal(true);
        setProductToDelete(product);
    };
    


    return (
        <div className="min-h-screen p-4 lg:p-0">
            <div className="flex flex-col lg:flex-row lg:space-x-8">

                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#8B4513] mb-6">Product List</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E9967A]"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <ProductCard key={product.id} product={product} onDelete={handleDeleteClick} />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">No products found.</p>
                                )}
                            </div>
                            <div className="mt-8">
                                <Pagination
                                    total={totalProducts}
                                    limit={12}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Right Sidebar for Search and Filters */}
                <aside className="w-full lg:w-64 mt-8 lg:mt-0 lg:sticky lg:top-4 h-fit bg-[#FFF5F0] rounded-xl shadow-md p-6">
                    {/* Search Section */}
                    <div>
                        <h3 className="font-semibold text-lg text-[#8B4513] mb-4">Search Products</h3>
                        <div className="relative">
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="w-full text-product-text p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9967A]"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-product-text" />
                        </div>
                    </div>

                    {/* Category Filter Section */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg text-[#8B4513] mb-4">Filter by Category</h3>
                        <ul className="space-y-2">
                            {categories.map(category => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => handleCategoryClick(category.id.toString())}
                                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${selectedCategory === category.id.toString()
                                            ? 'bg-[#E9967A] text-white font-semibold shadow-inner'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
            {showDeleteModal && productToDelete && (
                <DeleteConfirmationModal
                    product={productToDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setProductToDelete(null);
                    }}
                    onConfirm={() => {
                        // console.log("Deleting product:", productToDelete.id);

                        setShowDeleteModal(false);
                        setProductToDelete(null);
                    }}
                />
            )}


        </div>
    );
}
