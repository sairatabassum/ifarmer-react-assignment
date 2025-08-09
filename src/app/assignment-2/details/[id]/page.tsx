'use client'

import { Edit, Trash } from 'iconoir-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from "../../../../components/product/ProductDeleteModal";
import { getProductById } from "../../services/api";
import { Product } from "../../types/product";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const productId = Number(params.id);

    useEffect(() => {
        if (!productId) {
            setError("Product ID not found.");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const fetchedProduct = await getProductById(productId);
                setProduct(fetchedProduct);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleDeleteClick = () => {
        if (product) {
            setShowDeleteModal(true);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FFF5F0]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E9967A]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FFF5F0]">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FFF5F0]">
                <p className="text-gray-500">Product not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5F0] flex items-center justify-center p-4 lg:p-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full">
                <div className="flex flex-col lg:flex-row">

                    {/* Image Gallery Section */}
                    <div className="w-full lg:w-1/2 p-6 flex flex-col items-center justify-center">
                        <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-4">
                            <img
                                src={product.images[0] || 'https://placehold.co/600x600/E9967A/FFF?text=No+Image'}
                                alt={product.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="flex space-x-4 overflow-x-auto w-full">
                            {product.images.slice(0, 3).map((image, index) => (
                                <div key={index} className="flex-none w-24 h-24 rounded-lg overflow-hidden shadow-md cursor-pointer hover:ring-2 ring-[#E9967A] transition-all">
                                    <img
                                        src={image || 'https://placehold.co/100x100/E9967A/FFF?text=No+Image'}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-bold text-[#8B4513]">{product.title}</h1>
                            <span className="text-4xl font-bold text-[#E9967A]">${product.price}</span>
                        </div>

                        <div className="inline-block bg-[#E9967A] bg-opacity-20 text-[#8B4513] text-sm font-semibold px-4 py-1 rounded-full mb-6">
                            {product.category?.name || 'Uncategorized'}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-8">
                            <div>
                                <span className="font-semibold text-gray-700">Created:</span><br />
                                {new Date(product.creationAt || '').toLocaleDateString()}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Updated:</span><br />
                                {new Date(product.updatedAt || '').toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <Link href={`/assignment-2/edit/${product.id}`} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#E9967A] text-white font-bold shadow-lg hover:bg-[#D2691E] transition-colors">
                                <Edit className="h-5 w-5" />
                                <span>Edit Product</span>
                            </Link>
                            <button
                                onClick={handleDeleteClick}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <Trash className="h-5 w-5" />
                                <span>Delete Product</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteModal && product && (
                <DeleteConfirmationModal
                    product={product}
                    onConfirm={() => {
                        // console.log("Deleting product:", productToDelete.id);

                        setShowDeleteModal(false);
                    }} onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}