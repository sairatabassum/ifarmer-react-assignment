import { Product } from "../schemas/ProductCreateSchemas";

export interface FileUploadProps {
    onFileChange: (files: FileList | null) => void;
    selectedFiles: File[];
    existingImages: string[];
    onRemoveFile: (index: number) => void;
    onRemoveExistingImage: (index: number) => void;
    error?: string;
}


export type ProductFormValues = {
    title: string;
    price: number;
    description: string;
    categoryId: number; 
};
export interface Option {
    id: number;
    name: string;
}
  
export interface FormInputProps {
    label: string;
    name: keyof Product;
    register: any; 
    error?: string;
    type?: 'text' | 'number' | 'select';
    placeholder?: string;
    step?: string;
    min?: string;
    as?: 'input' | 'textarea' | 'select';
    options?: Option[];
}