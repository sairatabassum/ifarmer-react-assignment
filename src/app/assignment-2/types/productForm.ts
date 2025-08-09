import { Product } from "../schemas/ProductCreateSchemas";

export interface FileUploadProps {
    onFileChange: (files: FileList | null) => void;
    selectedFiles: File[];
    onRemoveFile: (index: number) => void;
    error?: string;
}

export type ProductFormData = Product & {
    productImages: File[];
};

export interface FormInputProps {
    label: string;
    name: keyof Product;
    register: any; // Using 'any' for now to simplify
    error?: string;
    type?: 'text' | 'number' | 'select';
    placeholder?: string;
    step?: string;
    min?: string;
    as?: 'input' | 'textarea' | 'select';
    options?: string[];
}