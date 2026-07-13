import { Product, Material, Testimonial } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "monarch-table",
    product: "The Monarch Dining Table",
    price: "₦1,250,000",
    category: "tables",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=800",
    spec: "Smoked Walnut & Brass",
  },
  {
    id: "solace-bookshelf",
    product: "The Solace Bookshelf",
    price: "₦450,000",
    category: "custom",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=800",
    spec: "Iroko Wood & Matte Black Steel",
  },
  {
    id: "lagos-sideboard",
    product: "The Lagos Sideboard",
    price: "₦890,000",
    category: "custom",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800",
    spec: "African Mahogany & Fluted Glass",
  },
  {
    id: "haven-bed",
    product: "The Haven Platform Bed",
    price: "₦1,150,000",
    category: "bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
    spec: "Teak & Ivory Bouclé Upholstery",
  },
  {
    id: "orbit-coffee-table",
    product: "The Orbit Coffee Table",
    price: "₦290,000",
    category: "tables",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800",
    spec: "Raw Concrete & Walnut Top",
  },
  {
    id: "prestige-desk",
    product: "The Prestige Writing Desk",
    price: "₦640,000",
    category: "office",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800",
    spec: "African Mahogany & Steel Legs",
  },
  {
    id: "alto-bar-stool",
    product: "The Alto Bar Stool",
    price: "₦180,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800",
    spec: "Aged Brass & Full-Grain Leather",
  },
  {
    id: "meridian-chair",
    product: "The Meridian Accent Chair",
    price: "₦420,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800",
    spec: "Sculpted Ash Wood & Woven Seat",
  },
  {
    id: "solace-lounge-chair",
    product: "The Solace Lounge Chair",
    price: "₦680,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800",
    spec: "Smoked Walnut & Full-Grain Leather",
  },
  {
    id: "vanguard-coffee-table",
    product: "The Vanguard Coffee Table",
    price: "₦310,000",
    category: "tables",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800",
    spec: "Iroko Wood & Matte Black Steel",
  },
  {
    id: "meridian-dresser",
    product: "The Meridian Chest of Drawers",
    price: "₦750,000",
    category: "bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800",
    spec: "African Mahogany & Fluted Glass",
  },
  {
    id: "obsidian-credenza",
    product: "The Obsidian Executive Desk",
    price: "₦1,050,000",
    category: "office",
    image: "https://images.unsplash.com/photo-1501501145250-ed8dfd8d246c?q=80&w=800",
    spec: "African Mahogany & Kano Brass",
  },
  {
    id: "lumina-bench",
    product: "The Lumina Entryway Bench",
    price: "₦320,000",
    category: "custom",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
    spec: "Raw Concrete & Smoked Walnut",
  },
  {
    id: "cascade-ottoman",
    product: "The Cascade Ottoman",
    price: "₦220,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800",
    spec: "Aged Brass & Full-Grain Leather",
  },
  {
    id: "ethereal-coffee-table",
    product: "The Ethereal Side Table",
    price: "₦240,000",
    category: "tables",
    image: "https://images.unsplash.com/photo-1577140917170-285929ef55af?q=80&w=800",
    spec: "Sculpted Ash Wood & Fluted Glass",
  },
  {
    id: "aura-dresser",
    product: "The Aura Fluted Credenza",
    price: "₦820,000",
    category: "bedroom",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
    spec: "Ebonized Oak & Polished Brass",
  },
  {
    id: "summit-credenza",
    product: "The Summit Credenza",
    price: "₦850,000",
    category: "office",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800",
    spec: "Carrara Marble & Matte Gunmetal",
  },
  {
    id: "apex-bench",
    product: "The Apex Burl Wood Bench",
    price: "₦380,000",
    category: "custom",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800",
    spec: "Premium Burl Wood & Brushed Bronze",
  },
  {
    id: "nova-armchair",
    product: "The Nova Bouclé Armchair",
    price: "₦480,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1517806428044-7153b27654ac?q=80&w=800",
    spec: "Solid Teak & Ivory Bouclé",
  },
  {
    id: "nexus-sofa",
    product: "The Nexus Leather Sofa",
    price: "₦2,450,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
    spec: "Ebonized Oak & Full-Grain Leather",
  },
  {
    id: "sovereign-ladder",
    product: "The Sovereign Library Ladder",
    price: "₦340,000",
    category: "custom",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800",
    spec: "Smoked Black Walnut & Aged Brass Fittings",
  },
  {
    id: "atelier-step-stool",
    product: "The Atelier Step Stool",
    price: "₦150,000",
    category: "seating",
    image: "https://images.unsplash.com/photo-1501685532562-aa6846b14a0e?q=80&w=800",
    spec: "Solid Iroko Wood & Double-Step Joints",
  }
];

export const MATERIALS: Material[] = [
  {
    name: "Calacatta Marble",
    origin: "Imported, Lagos Port",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800",
  },
  {
    name: "Aso-Oke Weave Linen",
    origin: "Handwoven, Iseyin",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
  },
  {
    name: "Smoked Black Walnut",
    origin: "Bespoke Cured, Lagos",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
  },
  {
    name: "Aged Brushed Brass",
    origin: "Kano Metalworks, Nigeria",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800",
  },
  {
    name: "Cordovan Leather",
    origin: "Tanneries, Kano",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800",
  },
  {
    name: "Hand Poured Concrete",
    origin: "Lagos Casting Yard",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The bespoke conference table from Vision Worth is the absolute centrepiece of our Ikoyi boardroom. Every client who walks in comments on its raw texture and quiet strength.",
    author: "Chidinma Okafor",
    title: "Architect, Lagos",
  },
  {
    quote: "We wanted furniture that represented contemporary Nigeria without leaning into stereotypes. Vision Worth delivered pieces that are global in standard, local in heart.",
    author: "Akintoye Davidson",
    title: "CEO, Davidson & Co, Ikoyi",
  },
  {
    quote: "The attention to wood grain alignment, seamless joints, and tactile finish is unmatched. Vision Worth is the best-kept secret in Nigerian luxury.",
    author: "Yejide Alabi",
    title: "Interior Designer, Lekki",
  },
];

export const EDITORIAL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    location: "Private Residence, Ikoyi",
  },
  {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
    location: "Master Bedroom, Victoria Island",
  },
  {
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800",
    location: "Showroom Study, Lagos",
  },
  {
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800",
    location: "Atelier Suite, Lekki",
  },
  {
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
    location: "Bespoke Suite, Port Harcourt",
  },
  {
    url: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=800",
    location: "Penthouse Lounge, Abuja",
  },
];
