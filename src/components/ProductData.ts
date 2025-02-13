import { IProduct, IProductData, TBasketItem } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class ProductData extends Model<IProduct[]> implements IProductData {
  private products: IProduct[];
  private basket: IProduct[];

  constructor(events: IEvents) {
    super([], events);
    this.products = [];
    this.basket = [];
  }

  setProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit('products:changed')
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  // Если нужно через геттер и сеттер
  // get products(): IProduct[] {
  //   return this._products;
  // }

  // set products(products: IProduct[]) {
  //   this._products = products;
  //   this.events.emit('products:changed')
  // }

  addItem(productId: string) {
    const addProduct = this.products.find(product => product.id === productId);
    if (addProduct) {
      this.basket.push(addProduct);
      this.events.emit('basket:changed')
    } else {
      console.log(`Товар с id ${productId} не найден`);
    }
  }

  removeItem(id: string) {
    this.basket = this.basket.filter(product => product.id !== id);
    this.events.emit('basket:changed')
  }

  getBasket(): IProduct[] {
    return this.basket;
  }

  getTotal(): number {
    return this.basket.reduce((total, product) => total + product.price, 0);
  }

  clearBasket() {
    this.basket = [];
    this.events.emit('basket:changed')
  }
}
