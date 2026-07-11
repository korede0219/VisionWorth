export interface Inquiry {
  refCode: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

export interface WishlistItem {
  product: string;
  price: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

export interface Product {
  id: string;
  product: string;
  price: string;
  category: string;
  image: string;
  spec: string;
}

export interface Material {
  name: string;
  origin: string;
  image: string;
}
