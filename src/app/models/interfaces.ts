export interface Product {
    productId: string;
    quantity: number;
    stock: number;
    price: number;
  }
  
export interface Order {
    id: string;
    customerName: string;
    email: string;
    products: Product[];
    total: number;
    orderCode: string;
    timestamp: string;
  }

export interface ProductForm {
    id: string;
    name: string;
    price: number;
    stock: number;
  }