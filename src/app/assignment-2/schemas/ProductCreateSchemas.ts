import { z } from 'zod';

export const productSchema = z.object({
    title: z
        .string()
        .nonempty({ message: "Product title is required." })
        .min(3, { message: "Product title must be at least 3 characters long." })
        .max(100, { message: "Product title cannot exceed 100 characters." }),
    price: z
        .number()
        .min(0.01, { message: "Price must be a positive number." }),
    categoryId: z
        .number()
        .min(1, { message: "Please select a category." }),
    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long." })
        .max(500, { message: "Description cannot exceed 500 characters." }),
});

export type Product = z.infer<typeof productSchema>;