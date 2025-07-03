import { Product } from "./Product";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  count: number;
  total: number;
}

export interface GetCartResponse {
  cart: Cart;
}
