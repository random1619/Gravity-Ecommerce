export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    category: string;
    imageUrl: string;
    isNew?: boolean;
    description: string;
    fabric: string;
    fit: string;
    care: string;
    images: string[];
    sizes: string[];
    reviews: { id: number; user: string; rating: number; comment: string }[];
}

export interface Collection {
    id: string;
    title: string;
    subtitle: string;
    itemCount: number;
    imageUrl: string;
    category?: string;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Oversized Graffiti Tee',
        price: 699,
        originalPrice: 1299,
        category: 'T-Shirts',
        isNew: true,
        imageUrl: '/product-tee.png',
        images: ['/product-tee.png', '/product-tee.png', '/product-tee.png'],
        description: 'Unleash your street style with our signature Graffiti Tee. Made from 100% premium heavy-weight cotton for that perfect oversized drape.',
        fabric: '100% Combed Cotton, 240 GSM',
        fit: 'Oversized / Boxy Fit',
        care: 'Machine wash cold, tumble dry low, do not iron on print.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        reviews: [
            { id: 1, user: 'Rahul S.', rating: 5, comment: 'Perfect fit! The quality is amazing.' },
            { id: 2, user: 'Anjali K.', rating: 4, comment: 'Love the oversized look.' }
        ]
    },
    {
        id: '2',
        name: 'Acid Wash Cargos',
        price: 999,
        originalPrice: 1899,
        category: 'Bottoms',
        isNew: true,
        imageUrl: '/product-cargos.png',
        images: ['/product-cargos.png'],
        description: 'Urban utility meets modern fit. These acid-wash cargos feature multi-pocket functionality and a tapered silhouette.',
        fabric: 'Heavyweight Twill Cotton',
        fit: 'Relaxed Tapered',
        care: 'Wash inside out with similar colors.',
        sizes: ['30', '32', '34', '36'],
        reviews: []
    },
    {
        id: '3',
        name: 'Desert Storm Hoodie',
        price: 1299,
        originalPrice: 2499,
        category: 'Hoodies',
        imageUrl: '/product-hoodie.png',
        images: ['/product-hoodie.png'],
        description: 'The ultimate comfort piece. Heavyweight fleece-lined hoodie with a minimalist aesthetic and drop shoulders.',
        fabric: '80% Cotton, 20% Polyester Fleece, 350 GSM',
        fit: 'Relaxed Drop Shoulder',
        care: 'Do not bleach. Dry flat.',
        sizes: ['M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '4',
        name: 'Cobalt Blue Joggers',
        price: 899,
        originalPrice: 1599,
        category: 'Bottoms',
        imageUrl: '/product-cargos.png',
        images: ['/product-cargos.png'],
        description: 'Vibrant cobalt blue joggers for a standout street look. Elasticated cuffs and premium drawstring detail.',
        fabric: 'Premium Loopback Cotton',
        fit: 'Slim Fit Jogger',
        care: 'Machine wash 30C.',
        sizes: ['S', 'M', 'L'],
        reviews: []
    },
    {
        id: '5',
        name: 'Retro Vibes Tee',
        price: 499,
        originalPrice: 899,
        category: 'T-Shirts',
        imageUrl: '/product-tee.png',
        images: ['/product-tee.png'],
        description: 'A classic boxy tee with subtle retro branding. Perfect for layering.',
        fabric: '180 GSM Single Jersey Cotton',
        fit: 'Boxy Fit',
        care: 'Cool iron on reverse.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '6',
        name: 'Basic Black Beanie',
        price: 299,
        originalPrice: 599,
        category: 'Accessories',
        imageUrl: '/product-acc.png',
        images: ['/product-acc.png'],
        description: 'Essential ribbed knit beanie for the winter drop. Soft, warm, and versatile.',
        fabric: '100% Soft-touch Acrylic',
        fit: 'One Size',
        care: 'Hand wash only.',
        sizes: ['One Size'],
        reviews: []
    },
    {
        id: '7',
        name: 'Silver Chain Necklace',
        price: 399,
        originalPrice: 799,
        category: 'Accessories',
        imageUrl: '/product-acc.png',
        images: ['/product-acc.png'],
        description: 'High-quality silver-finished curb chain. A staple accessory for any streetwear outfit.',
        fabric: 'Stainless Steel with Silver Finish',
        fit: '20 inch length',
        care: 'Avoid contact with perfumes and water.',
        sizes: ['Standard'],
        reviews: []
    },
    {
        id: '10',
        name: 'Distressed Denim Jacket',
        price: 1499,
        originalPrice: 2999,
        category: 'Outerwear',
        imageUrl: '/product-jacket.png',
        images: ['/product-jacket.png'],
        description: 'Heavyweight distressed denim jacket with a vintage wash. The cornerstone of a classic urban wardrobe.',
        fabric: '14oz Premium Denim',
        fit: 'Standard Trucker Fit',
        care: 'Wash rarely for character.',
        sizes: ['M', 'L', 'XL'],
        reviews: []
    }
];

export const getProducts = (category?: string, maxPrice?: number) => {
    return products.filter(p => {
        const matchesCategory = !category || category === 'All' || p.category.toLowerCase() === category.toLowerCase();
        const matchesPrice = !maxPrice || p.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });
};

export const getProductById = (id: string) => {
    return products.find(p => p.id === id);
};

export const collections: Collection[] = [
    {
        id: 'oversized',
        title: 'THE OVERSIZED DROP',
        subtitle: 'Maximum comfort. Maximum drip.',
        itemCount: 12,
        imageUrl: '/product-tee.png',
        category: 'T-Shirts',
    },
    {
        id: 'cargos',
        title: 'URBAN CARGOS',
        subtitle: 'Function meets street style.',
        itemCount: 8,
        imageUrl: '/product-cargos.png',
        category: 'Bottoms',
    },
    {
        id: 'anime',
        title: 'ANIME & MANGA',
        subtitle: 'Wear your fandom.',
        itemCount: 15,
        imageUrl: '/product-hoodie.png',
        category: 'Hoodies',
    },
    {
        id: 'accessories',
        title: 'STREET ACCS',
        subtitle: 'Complete the look.',
        itemCount: 20,
        imageUrl: '/product-acc.png',
        category: 'Accessories',
    }
];

export const cartItems = [
    { id: '1', name: 'Oversized Graffiti Tee', price: 699, size: 'M', quantity: 1, imageUrl: '/product-tee.png' },
    { id: '2', name: 'Acid Wash Cargos', price: 999, size: 'L', quantity: 1, imageUrl: '/product-cargos.png' },
];
