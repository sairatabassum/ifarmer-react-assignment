import { Edit, Eye, Trash } from 'iconoir-react';
import Link from 'next/link';
import { Product } from "../../app/assignment-2/types/product";

export const ProductCard = ({ product, onDelete }: { product: Product; onDelete: (product: Product) => void; }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="relative">
            <img
                src={product.images[0] || 'https://placehold.co/400x300/E9967A/FFF?text=No+Image'}
                alt={product.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/400x300/E9967A/FFF?text=No+Image';
                }}
            />
            <span className="absolute top-3 right-3 bg-[#E9967A] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                ${product.price}
            </span>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-product-rose truncate">{product.title}</h3>
            <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full my-2">
                {product.category?.name || 'Uncategorized'}
            </span>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <Link href={`/assignment-2/details/${product.id}`} className="text-product-rose transition-colors p-2 rounded-lg hover:bg-gray-100">
                    <Eye className="h-5 w-5" />
                </Link>
                <Link href={`/assignment-2/edit/${product.id}`} className="text-product-rose transition-colors p-2 rounded-lg hover:bg-gray-100">
                    <Edit className="h-5 w-5" />
                </Link>
                <button
                    onClick={() => onDelete(product)}
                    className="text-product-rose  transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                    <Trash className="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
);