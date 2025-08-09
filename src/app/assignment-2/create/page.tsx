'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Xmark } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../../components/common/Button';
import { Toaster } from '../../../components/common/Toaster';
import cn from '../../../utils/cn';
import { productSchema } from '../schemas/ProductCreateSchemas';
import { createProduct, getCategories, getProductById, updateProduct } from '../services/api';
import { Category } from '../types/product';
import { FileUploadProps, FormInputProps, ProductFormValues } from '../types/productForm';


const FormInput = ({ label, name, register, error, type = 'text', placeholder, step, min, as = 'input', options }: FormInputProps) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#8B4513] mb-1">
            {label}
        </label>
        {as === 'textarea' ? (
            <textarea
                id={name}
                {...register(name)}
                rows={4}
                placeholder={placeholder}
                className={`w-full p-3 border rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#E9967A] resize-y ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
        ) : as === 'select' ? (
            <select
                id={name}
                {...register(name, { valueAsNumber: true })} // Use valueAsNumber to correctly register the ID
                className={`w-full p-3 border rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#E9967A] ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <option value="" disabled>Select a category</option>
                {options?.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option> // Use category.id as value
                ))}
            </select>
        ) : (
            <input
                type={type}
                id={name}
                {...register(name, { valueAsNumber: type === 'number' })}
                placeholder={placeholder}
                step={step}
                min={min}
                className={`w-full p-3 border rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#E9967A] ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
        )}
        {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
    </div>
);

const FileUpload = ({ onFileChange, selectedFiles, existingImages, onRemoveFile, onRemoveExistingImage, error }: FileUploadProps) => (
    <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-[#8B4513] mb-1">
            Product Images
        </label>
        <div className="flex items-center space-x-2">
            <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                onChange={(e) => onFileChange(e.target.files)}
                className="hidden"
            />
            <label
                htmlFor="file-upload"
                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer text-[#8B4513] hover:border-[#E9967A] transition-colors duration-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <Upload className="h-8 w-8 mb-2 text-[#8B4513]" />
                <span className="text-sm font-medium text-center">Drag and drop images here, or click to browse.</span>
            </label>
        </div>
        {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        {(selectedFiles.length > 0 || existingImages.length > 0) && (
            <ul className="mt-4 space-y-2">
                {existingImages.map((imageUrl: string, index: number) => (
                    <li key={`existing-${index}`} className="flex items-center justify-between p-2 bg-[#FFF5F0] rounded-lg border border-gray-300">
                        <img src={imageUrl} alt={`Existing product image ${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
                        <span className="truncate text-sm text-[#8B4513] flex-grow ml-2">{imageUrl}</span>
                        <button
                            type="button"
                            onClick={() => onRemoveExistingImage(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                            <Xmark className="h-4 w-4" />
                        </button>
                    </li>
                ))}
                {selectedFiles.map((file, index) => (
                    <li key={`new-${index}`} className="flex items-center justify-between p-2 bg-[#FFF5F0] rounded-lg border border-gray-300">
                        <span className="truncate text-sm text-[#8B4513]">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => onRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                            <Xmark className="h-4 w-4" />
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

// form component
export default function ProductForm({ productId }: { productId?: number }) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        mode: "onTouched",
        defaultValues: {
            title: '',
            price: 0.01,
            categoryId: 0,
            description: '',
        },
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [fileError, setFileError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" | "warning" }>({
        show: false,
        message: '',
        type: 'info',
    });
    const [categories, setCategories] = useState<Category[]>([]);


    const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 9000);
    };

    const fetchProduct = async (productId: number) => {
        try {
            const productData = await getProductById(productId);
            reset({
                title: productData.title,
                price: productData.price,
                description: productData.description,
                categoryId: productData.category?.id,
            });
            setExistingImages(productData.images);
        } catch (err) {
            console.error("Failed to fetch product:", err);
            setError("Failed to load product details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            showToast("Failed to load categories.", "error");
        }
    };

    useEffect(() => {
        fetchCategories();
        if (productId) {
            setLoading(true);
            fetchProduct(productId);
        }
    }, [productId, reset]);


    const handleFileChange = (files: FileList | null) => {
        if (files) {
            setSelectedFiles(Array.from(files));
            setFileError(undefined);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveExistingImage = (indexToRemove: number) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        let isValid = true;

        if (selectedFiles.length === 0 && existingImages.length === 0) {
            isValid = false;
            setFileError("At least one product image is required.");
        } else {
            setFileError(undefined);
        }

        if (!isValid) {
            return;
        }


        const newFilePlaceholders = selectedFiles.map(() => `https://placehold.co/600x400`);
        const allImageUrls = [...existingImages, ...newFilePlaceholders];

        const productPayload = {
            title: data.title,
            price: data.price,
            description: data.description,
            categoryId: data.categoryId, // Pass the category ID directly
            images: allImageUrls,
        };


        try {
            if (productId) {
                await updateProduct(productId, productPayload);
                showToast('Product updated successfully!', 'success');
            } else {
                await createProduct(productPayload);
                showToast('Product created successfully!', 'success');
            }
            router.push('/assignment-2/products');
        } catch (err) {
            console.error("Failed to submit product:", err);
            showToast('Failed to submit product. Please try again.', 'error');
        }
    };

    const hasErrors = Object.keys(errors).length > 0 || !!fileError;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#FFF5F0]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E9967A]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#FFF5F0]">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-lg md:max-w-2xl bg-[#FFF5F0] rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-3xl font-semibold text-[#8B4513] mb-6">
                    {productId ? 'Edit Product' : 'Create New Product'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <FormInput
                        label="Product Title"
                        name="title"
                        register={register}
                        placeholder="Enter product title"
                        error={errors.title?.message}
                    />

                    <FormInput
                        label="Price ($)"
                        name="price"
                        type="number"
                        register={register}
                        step="0.01"
                        min="0"
                        placeholder="0"
                        error={errors.price?.message}
                    />

                    <FormInput
                        label="Category"
                        name="categoryId"
                        register={register}
                        as="select"
                        options={categories}
                        error={errors.categoryId?.message}
                    />

                    <FormInput
                        label="Description"
                        name="description"
                        register={register}
                        placeholder="Enter product description"
                        error={errors.description?.message}
                        as="textarea"
                    />

                    <FileUpload
                        onFileChange={handleFileChange}
                        selectedFiles={selectedFiles}
                        existingImages={existingImages}
                        onRemoveFile={handleRemoveFile}
                        onRemoveExistingImage={handleRemoveExistingImage}
                        error={fileError}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        disabled={hasErrors}
                        className={cn(
                            "w-full font-bold shadow-md transition-colors duration-200",
                            hasErrors ? "bg-gray-400 cursor-not-allowed" : "bg-[#E9967A] hover:bg-[#D2691E]"
                        )}
                    >
                        {productId ? 'Save Changes' : 'Create Product'}
                    </Button>

                </form>
            </div>
            {toast.show && <Toaster message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

        </div>
    );
}
