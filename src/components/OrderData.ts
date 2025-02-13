import { FormErrors, IOrder, IOrderData, IOrderForm, IOrderResult } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class OrderData extends Model<IOrderData[]> implements IOrderData {
  private order: IOrder;
  private formErrors: FormErrors = {};

  constructor(events: IEvents) {
      super([], events);
      this.order = {
        payment: "",
        email: "",
        phone: "",
        address: "",
        total: 0,
        items: [],
      };
    }

  setOrder(order: IOrder) {
    this.order = order;
    this.events.emit("order:changed");
  }

  getOrder(): IOrder {
    return this.order;
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearValidate() {
    this.formErrors = {};
    this.events.emit("order:validate:clear");
  }
}
