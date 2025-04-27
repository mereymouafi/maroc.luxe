// Mock product data
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  color: string;
  dimensions: string;
  material: string;
  madeIn: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Tote Bag",
    price: 1950,
    description: "Crafted from the finest leather, our Classic Tote Bag combines timeless design with modern functionality. Spacious enough for all your essentials, this versatile piece features a secure zip closure and an interior pocket.",
    category: "handbags",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
      "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg",
      "https://images.pexels.com/photos/2002717/pexels-photo-2002717.jpeg"
    ],
    isNew: true,
    color: "Black",
    dimensions: "35 × 29 × 18 cm",
    material: "Full-grain calfskin leather",
    madeIn: "Italy"
  },
  {
    id: 2,
    name: "Signature Shoulder Bag",
    price: 2250,
    description: "Our Signature Shoulder Bag exemplifies luxury and sophistication. This iconic design features our distinctive pattern, premium hardware, and adjustable strap for versatile carrying options.",
    category: "handbags",
    image: "https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg",
    images: [
      "https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg",
      "https://images.pexels.com/photos/5234763/pexels-photo-5234763.jpeg",
      "https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg"
    ],
    isBestSeller: true,
    color: "Cream",
    dimensions: "26 × 18 × 10 cm",
    material: "Premium leather with gold-tone hardware",
    madeIn: "France"
  },
  {
    id: 3,
    name: "Elegant Crossbody",
    price: 1650,
    description: "Perfect for everyday elegance, our Elegant Crossbody combines style with practicality. The sleek design houses multiple compartments while maintaining a slim profile.",
    category: "handbags",
    image: "https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg",
    images: [
      "https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg",
      "https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg",
      "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg"
    ],
    color: "Burgundy",
    dimensions: "22 × 15 × 6 cm",
    material: "Grained calfskin leather",
    madeIn: "Italy"
  },
  {
    id: 4,
    name: "Mini Evening Clutch",
    price: 950,
    description: "Our Mini Evening Clutch is the perfect companion for sophisticated evenings. Crafted with exquisite attention to detail, it features a detachable chain strap and secure magnetic closure.",
    category: "handbags",
    image: "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg",
    images: [
      "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg",
      "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg",
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg"
    ],
    isNew: true,
    color: "Gold",
    dimensions: "20 × 12 × 4 cm",
    material: "Satin with crystal embellishments",
    madeIn: "France"
  },
  {
    id: 5,
    name: "Luxury Leather Wallet",
    price: 650,
    description: "Our Luxury Leather Wallet combines functionality with elegant design. Featuring multiple card slots, bill compartments, and a secure coin pocket, it's the perfect accessory for organizing your essentials.",
    category: "wallets",
    image: "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg",
    images: [
      "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg",
      "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg",
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg"
    ],
    isBestSeller: true,
    color: "Brown",
    dimensions: "19 × 10 × 2 cm",
    material: "Full-grain leather",
    madeIn: "Spain"
  },
  {
    id: 6,
    name: "Designer Sunglasses",
    price: 450,
    description: "Our Designer Sunglasses combine fashion with function. The distinctive silhouette features UV protection, luxurious materials, and our subtle logo embellishment.",
    category: "accessories",
    image: "https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg",
    images: [
      "https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg",
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg"
    ],
    color: "Tortoiseshell",
    dimensions: "145mm temple length",
    material: "Acetate frame with gold-tone accents",
    madeIn: "Italy"
  },
  {
    id: 7,
    name: "Signature Silk Scarf",
    price: 350,
    description: "Our Signature Silk Scarf adds a touch of luxury to any outfit. Hand-printed with our exclusive patterns, this versatile accessory can be styled multiple ways.",
    category: "accessories",
    image: "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg",
    images: [
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg",
      "https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg",
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
    ],
    color: "Multicolor",
    dimensions: "90 × 90 cm",
    material: "100% Silk twill",
    madeIn: "France"
  },
  {
    id: 8,
    name: "Leather Card Holder",
    price: 250,
    description: "Sleek and sophisticated, our Leather Card Holder is perfect for those who prefer a minimal approach. Despite its slim profile, it accommodates all your essential cards and features our distinctive gold embossing.",
    category: "wallets",
    image: "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg",
    images: [
      "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg",
      "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg",
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
    ],
    color: "Navy Blue",
    dimensions: "10 × 7 × 1 cm",
    material: "Saffiano leather",
    madeIn: "Italy"
  },
  {
    id: 9,
    name: "Limited Edition Weekend Bag",
    price: 3850,
    description: "Part of our exclusive collection, the Limited Edition Weekend Bag combines distinctive design with practical functionality. Perfect for short getaways, it features ample storage, premium materials, and our signature detailing.",
    category: "collections",
    image: "https://images.pexels.com/photos/2002717/pexels-photo-2002717.jpeg",
    images: [
      "https://images.pexels.com/photos/2002717/pexels-photo-2002717.jpeg",
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
      "https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg"
    ],
    isNew: true,
    color: "Tan",
    dimensions: "55 × 35 × 25 cm",
    material: "Premium leather with canvas accents",
    madeIn: "France"
  },
  {
    id: 10,
    name: "Heritage Collection Watch",
    price: 5950,
    description: "Our Heritage Collection Watch represents the pinnacle of luxury timekeeping. Featuring Swiss movement, sapphire crystal, and hand-finished details, this exceptional timepiece combines traditional craftsmanship with modern technology.",
    category: "collections",
    image: "https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg",
    images: [
      "https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg",
      "https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg",
      "https://images.pexels.com/photos/2002717/pexels-photo-2002717.jpeg"
    ],
    isBestSeller: true,
    color: "Silver/Gold",
    dimensions: "40mm case diameter",
    material: "Stainless steel with alligator leather strap",
    madeIn: "Switzerland"
  },
  {
    id: 11,
    name: "Classic Belt",
    price: 450,
    description: "Our Classic Belt is the perfect finishing touch for any outfit. Crafted from the finest leather and featuring our distinctive buckle, it offers both style and durability.",
    category: "accessories",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    images: [
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
      "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg",
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg"
    ],
    color: "Black",
    dimensions: "3.5cm width",
    material: "Full-grain leather with palladium-finish buckle",
    madeIn: "Italy"
  },
  {
    id: 12,
    name: "Exotic Skin Evening Bag",
    price: 4250,
    description: "Our Exotic Skin Evening Bag is the epitome of luxury. Meticulously crafted from the finest materials, this statement piece features a jeweled clasp and chain strap, perfect for special occasions.",
    category: "handbags",
    image: "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg",
    images: [
      "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg",
      "https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg",
      "https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg"
    ],
    color: "Emerald Green",
    dimensions: "18 × 10 × 5 cm",
    material: "Exotic leather with crystal embellishments",
    madeIn: "France"
  }
];