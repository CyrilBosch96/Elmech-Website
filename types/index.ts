export interface ProductItem {
  id: string;
  description: string;
  groupCategory: string;
  section: string;
  code: string;
  capacity: string;
  mrp: number;
  lift: string;
  unit: string;
  active: boolean;
}

export interface QuotationProduct {
  productId: string;
  productName: string;
  quantity: number;
  mrpEach: number;
  subtotal: number;
}

export interface QuotationRequest {
  customerName: string;
  companyName: string;
  email: string;
  city: string;
  phone: string;
  products: { productId: string; quantity: number }[];
}

export interface QuotationData {
  ref: string;
  date: string;
  customerName: string;
  companyName: string;
  email: string;
  city: string;
  phone: string;
  products: QuotationProduct[];
  totalMRP: number;
}
