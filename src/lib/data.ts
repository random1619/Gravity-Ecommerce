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
        imageUrl: '/product-tee-premium.png',
        images: ['/product-tee-premium.png', '/product-tee-premium.png', '/product-tee-premium.png'],
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
        imageUrl: '/product-cargos-premium.png',
        images: ['/product-cargos-premium.png'],
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
        imageUrl: '/product-hoodie-premium.png',
        images: ['/product-hoodie-premium.png'],
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
        imageUrl: '/product-jacket-premium.png',
        images: ['/product-jacket-premium.png'],
        description: 'Heavyweight distressed denim jacket with a vintage wash. The cornerstone of a classic urban wardrobe.',
        fabric: '14oz Premium Denim',
        fit: 'Standard Trucker Fit',
        care: 'Wash rarely for character.',
        sizes: ['M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '11',
        name: 'Graphic Anime Hoodie',
        price: 1399,
        originalPrice: 2599,
        category: 'Hoodies',
        imageUrl: '/product-anime-hoodie.png',
        images: ['/product-anime-hoodie.png'],
        description: 'Express your fandom with this graphic anime print hoodie. Soft brushed interior and durable screenprint.',
        fabric: '80% Cotton, 20% Polyester',
        fit: 'Relaxed Fit',
        care: 'Wash cold inside out. Do not tumble dry.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '12',
        name: 'Cargo Jogger Pants',
        price: 1099,
        originalPrice: 1999,
        category: 'Bottoms',
        imageUrl: '/product-cargos.png',
        images: ['/product-cargos.png'],
        description: 'Combining joggers comfort with utility cargo pockets. Features adjustable drawstrings and cuffs.',
        fabric: 'Stretch Twill Cotton',
        fit: 'Relaxed Fit',
        care: 'Machine wash warm.',
        sizes: ['30', '32', '34', '36'],
        reviews: []
    },
    {
        id: '13',
        name: 'Vintage Varsity Jacket',
        price: 1799,
        originalPrice: 3499,
        category: 'Outerwear',
        imageUrl: '/product-varsity-jacket.png',
        images: ['/product-varsity-jacket.png'],
        description: 'Classic retro varsity jacket with contrast faux-leather sleeves and embroidered patch details.',
        fabric: 'Wool Blend Body, PU Sleeves',
        fit: 'Regular Fit',
        care: 'Dry clean only.',
        sizes: ['M', 'L', 'XL', 'XXL'],
        reviews: []
    },
    {
        id: '14',
        name: 'Streetwear Utility Vest',
        price: 1299,
        originalPrice: 2299,
        category: 'Outerwear',
        imageUrl: '/product-jacket.png',
        images: ['/product-jacket.png'],
        description: 'Techwear style utility vest with multiple tactical pockets and adjustable harness straps.',
        fabric: 'Nylon Taslan fabric',
        fit: 'Adjustable Utility Fit',
        care: 'Wipe clean with a damp cloth.',
        sizes: ['One Size Fits All'],
        reviews: []
    },
    {
        id: '15',
        name: 'Minimalist Cotton Cap',
        price: 349,
        originalPrice: 699,
        category: 'Accessories',
        imageUrl: '/product-acc.png',
        images: ['/product-acc.png'],
        description: 'Low-profile dad hat made from washed cotton with adjustable metal buckle back closure.',
        fabric: '100% Cotton Twill',
        fit: 'Adjustable Strapback',
        care: 'Hand wash cold.',
        sizes: ['One Size'],
        reviews: []
    },
    {
        id: '16',
        name: 'Canvas Totebag',
        price: 449,
        originalPrice: 899,
        category: 'Accessories',
        imageUrl: '/product-canvas-tote.png',
        images: ['/product-canvas-tote.png'],
        description: 'Spacious heavyweight canvas tote bag with inner pocket and reinforced box-stitched handles.',
        fabric: '12oz Organic Cotton Canvas',
        fit: 'One Size',
        care: 'Spot clean only.',
        sizes: ['One Size'],
        reviews: []
    },
    {
        id: '17',
        name: 'Cyberpunk Print Tee',
        price: 749,
        originalPrice: 1399,
        category: 'T-Shirts',
        imageUrl: '/product-tee.png',
        images: ['/product-tee.png'],
        description: 'Futuristic neon typography and cyberpunk aesthetics printed on a heavy drop-shoulder tee.',
        fabric: '100% Combed Cotton, 220 GSM',
        fit: 'Boxy Oversized',
        care: 'Wash inside out, do not iron directly on print.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '18',
        name: 'Oversized Flannel Shirt',
        price: 1199,
        originalPrice: 2199,
        category: 'Outerwear',
        imageUrl: '/product-jacket.png',
        images: ['/product-jacket.png'],
        description: 'Classic lumberjack style plaid flannel shirt with a modern relaxed fit and double chest pockets.',
        fabric: '100% Cotton Flannel',
        fit: 'Loose / Oversized',
        care: 'Machine wash cold with like colors.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '19',
        name: 'Pastel Tie-Dye Tee',
        price: 599,
        originalPrice: 1099,
        category: 'T-Shirts',
        imageUrl: '/product-tee.png',
        images: ['/product-tee.png'],
        description: 'Vibrant custom tie-dye pattern. Each piece is individually dyed for a unique look.',
        fabric: '100% Ring-spun Cotton',
        fit: 'Relaxed Fit',
        care: 'Wash separately in cold water.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '20',
        name: 'Heavyweight Zip Hoodie',
        price: 1599,
        originalPrice: 2999,
        category: 'Hoodies',
        imageUrl: '/product-hoodie.png',
        images: ['/product-hoodie.png'],
        description: 'Premium full-zip hoodie with custom hardware, double-lined hood, and kangaroo pocket.',
        fabric: '85% Cotton, 15% Polyester, 400 GSM',
        fit: 'Standard Fit',
        care: 'Dry flat. Wash cold.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        reviews: []
    },
    {
        id: '21',
        name: 'Corduroy Pants',
        price: 1299,
        originalPrice: 2499,
        category: 'Bottoms',
        imageUrl: '/product-cargos.png',
        images: ['/product-cargos.png'],
        description: 'Retro corduroy trousers featuring deep side pockets, standard straight-leg fit, and premium belt loops.',
        fabric: '8-Wale Premium Corduroy',
        fit: 'Straight Fit',
        care: 'Wash inside out.',
        sizes: ['30', '32', '34', '36'],
        reviews: []
    },
    {
        id: '22',
        name: 'Premium Leather Belt',
        price: 599,
        originalPrice: 1199,
        category: 'Accessories',
        imageUrl: '/product-acc.png',
        images: ['/product-acc.png'],
        description: 'Genuine textured black leather belt with a solid gunmetal roller buckle.',
        fabric: '100% Genuine Leather',
        fit: 'Adjustable',
        care: 'Wipe with dry cloth.',
        sizes: ['M', 'L'],
        reviews: []
    },
    {
        id: '23',
        name: 'Techwear Windbreaker',
        price: 1999,
        originalPrice: 3999,
        category: 'Outerwear',
        imageUrl: '/product-jacket.png',
        images: ['/product-jacket.png'],
        description: 'Waterproof techwear windbreaker shell jacket with seam-sealed zippers, hood, and toggle adjusters.',
        fabric: 'Polyester Shell with DWR Coating',
        fit: 'Regular Fit',
        care: 'Machine wash cold on gentle cycle.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '24',
        name: 'Embroidered Sweatpants',
        price: 949,
        originalPrice: 1699,
        category: 'Bottoms',
        imageUrl: '/product-cargos.png',
        images: ['/product-cargos.png'],
        description: 'Ultra-soft fleece joggers featuring minimalist logo embroidery on the thigh, deep side pockets, and elastic hem.',
        fabric: '70% Cotton, 30% Polyester Fleece',
        fit: 'Relaxed Jogger Fit',
        care: 'Tumble dry low.',
        sizes: ['S', 'M', 'L', 'XL'],
        reviews: []
    },
    {
        id: '25',
        name: 'Oversized Mock Neck Tee',
        price: 649,
        originalPrice: 1199,
        category: 'T-Shirts',
        imageUrl: '/product-tee.png',
        images: ['/product-tee.png'],
        description: 'Clean streetwear look with a slightly raised collar and heavy-weight fabric drape.',
        fabric: '100% Organic Cotton, 260 GSM',
        fit: 'Oversized Mock Neck',
        care: 'Wash cold, line dry.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        reviews: []
    },
    {
        id: '26',
        name: 'Metal Layered Bracelet',
        price: 349,
        originalPrice: 699,
        category: 'Accessories',
        imageUrl: '/product-acc.png',
        images: ['/product-acc.png'],
        description: 'Layered Cuban link and bead bracelet with a secure lobster clasp. Made of high-grade hypoallergenic alloy.',
        fabric: 'Hypoallergenic Zinc Alloy',
        fit: '7.5 inch circumference',
        care: 'Keep dry, avoid chemicals.',
        sizes: ['One Size'],
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
