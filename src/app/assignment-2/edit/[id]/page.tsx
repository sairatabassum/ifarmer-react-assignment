'use client'

import ProductForm from "../../create/page";

export default function EditProductPage({ params }: { params: { id: string } }) {
    const productId = Number(params.id);
    return <ProductForm productId={productId} />;
}