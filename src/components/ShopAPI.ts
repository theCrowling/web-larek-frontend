import { IOrder, IOrderResult, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IShopAPI {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  postOrder(order: IOrder): Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string) {
    super(baseUrl);
    this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]> {
    return this.get("/product")
      .then((data: ApiListResponse<IProduct>) => {
        console.log("Получаем из апи:", data);
        return data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image,
        }))
      });
  }

  getProduct(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`)
      .then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image,
        })
      );
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order)
    .then(
      (data: IOrderResult) => data
  );
  }
}
