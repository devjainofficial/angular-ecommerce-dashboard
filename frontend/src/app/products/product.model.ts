export interface ProductVariant {
    size?: string;
    color?: string;
    sku?: string;
    priceDiff?: number;
}

export interface Product{
    id?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    variants?: ProductVariant[];
}   