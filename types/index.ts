export interface ProductItem {
  id: string;
  category: string;
  series: string;
  product_name: string;
  capacity_tonnes: number | null;
  lift_height_metres: number | null;
  suspension_type: string | null;
  trolley_range: string | null;
  duty_class: string | null;
  speed_type: string | null;
  indef_code: string | null;
  mrp_inr: number;
  notes: string | null;
}

export interface QuotationProduct {
  productId: string;
  productName: string;
  capacityTonnes: number | null;
  liftHeightMetres: number | null;
  suspensionType: string | null;
  indefCode: string | null;
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
