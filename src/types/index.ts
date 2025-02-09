export interface IShopAPI {
  getProducts(): Promise<IProduct[]>;
  getProduct?(id: string): Promise<IProduct>;
  postOrder?(order: IOrder): Promise<void>;
}

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
  orderList: IProduct[];
}

export interface IProductModel {
  products: IProduct[];
  basket: TBasketItem[];
  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;
  addItem(id: string): void;
  removeItem(id: string): void;
  getBasket(): TBasketItem[];
  getTotal(): number;
  clearBasket(): void;
}

export interface IOrderModel {
  order: IOrder;
  setOrder(order: IOrderForm): void;
  validateOrder(data: Record<keyof IOrderForm, string>): boolean;
  clearValidate(): void;
  postOrder(): Promise<void>;
}

export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
