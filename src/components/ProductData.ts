import { IProduct, IProductData, TBasketItem } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class ProductData extends Model<IProduct[]> implements IProductData {
  private products: IProduct[];
  private basket: IProduct[];
  // private preview: IProduct | null;

  constructor(events: IEvents) {
    super([], events);
    this.products = [];
    this.basket = [];
    // this.preview = null;
  }

  setProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit('products:changed')
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: string): IProduct {
    return this.products.find(product => product.id === id);
  }

  // не используется
  // setPreview(product: IProduct) {
  //   this.preview = product;
  //   this.events.emit('preview:changed', product)
  // }

  addItem(id: string) {
    const addProduct = this.products.find(product => product.id === id);
    const index = this.basket.length + 1;
    if (addProduct) {
      this.basket.push({...addProduct, itemIndex: index});
      this.events.emit('basket:changed')
    } else {
      console.log(`Товар с id ${id} не найден`);
    }
  }

  removeItem(id: string) {
    this.basket = this.basket.filter(product => product.id !== id);
    this.updateIndexes();
    this.events.emit('basket:changed')
  }

  isInBasket(id: string): boolean {
    return this.basket.some(product => product.id === id);
  }

  updateIndexes() {
    this.basket.forEach((product, index) => {
      product.itemIndex = index + 1;
    });
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
