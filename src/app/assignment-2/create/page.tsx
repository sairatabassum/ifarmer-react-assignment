'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Xmark } from 'iconoir-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../../components/common/Button';
import cn from '../../../utils/cn';
import { Product, productSchema } from '../schemas/ProductCreateSchemas';
import { FileUploadProps, FormInputProps } from '../types/productForm';

const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
];

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
                {...register(name)}
                className={`w-full p-3 border rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#E9967A] ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <option value="" disabled>Select a category</option>
                {options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
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

const FileUpload = ({ onFileChange, selectedFiles, onRemoveFile, error }: FileUploadProps) => (
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

        {selectedFiles.length > 0 && (
            <ul className="mt-4 space-y-2">
                {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-[#FFF5F0] rounded-lg border border-gray-300">
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

export default function ProductForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Product>({
        resolver: zodResolver(productSchema),
        mode: "onTouched",
        defaultValues: {
            productTitle: '',
            price: 0.01,
            category: '',
            description: '',
        }
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | undefined>(undefined);

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            setSelectedFiles(Array.from(files));
            setFileError(undefined);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const onSubmit: SubmitHandler<Product> = (data) => {
        let isValid = true;

        if (selectedFiles.length === 0) {
            isValid = false;
            setFileError("At least one product image is required.");
        } else {
            setFileError(undefined);
        }

        if (!isValid) {
            return;
        }

        console.log('Form submitted successfully:', { ...data, productImages: selectedFiles });
        alert('Form submitted successfully!');
    };

    const hasErrors = Object.keys(errors).length > 0 || !!fileError;

    return (
        <div className="flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-lg md:max-w-2xl bg-[#FFF5F0] rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-3xl font-semibold text-[#8B4513] mb-6">Create New Product</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <FormInput
                        label="Product Title"
                        name="productTitle"
                        register={register}
                        placeholder="Enter product title"
                        error={errors.productTitle?.message}
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
                        name="category"
                        register={register}
                        as="select"
                        options={categories}
                        error={errors.category?.message}
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
                        onRemoveFile={handleRemoveFile}
                        error={fileError}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        disabled={hasErrors}
                        className={cn(
                            "w-full font-bold shadow-md transition-colors duration-200",
                            hasErrors ? "bg-gray-400 cursor-not-allowed" : "bg-product-rose hover:bg-product-rose-hover"
                        )}
                    >
                        Create Product
                    </Button>

                </form>
            </div>
        </div>
    );
}
