export interface IProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  description: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductData {
  setProducts(products: IProduct[]): void;
  getProducts(): IProduct[];
  addItem(id: string): void;
  removeItem(id: string): void;
  getBasket(): IProduct[];
  getTotal(): number;
  clearBasket(): void;
}

export interface IOrderData {
  setOrder(order: IOrder): void;
  getOrder(): IOrder;
  validateOrder(data: Record<keyof IOrderForm, string>): boolean;
  clearValidate(): void;
}

export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
