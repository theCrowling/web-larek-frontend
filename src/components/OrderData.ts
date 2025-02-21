import { FormErrors, IOrder, IOrderData, IOrderForm } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class OrderData extends Model<IOrder[]> implements IOrderData {
  private order: IOrder;
  private formErrorsOrder: FormErrors = {};
  private formErrorsContact: FormErrors = {};

  constructor(events: IEvents) {
    super([], events);
    this.order = {
      payment: null,
      email: "",
      phone: "",
      address: "",
      total: 0,
      items: []
    };
  }

  set items(items: string[]) {
    this.order.items = items;
    this.events.emit("order:changed", this.order);
  }

  set total(total: number) {
    this.order.total = total;
    this.events.emit("order:changed", this.order);
  }

  setPayment(payment: string | null) {
    this.order.payment = payment;
    this.events.emit("order:changed", this.order);
  }

  getOrder(): IOrder {
    return this.order;
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    const isOrderValid = this.validateOrder();
    const isContactValid = this.validateСontact();
    if (isOrderValid && isContactValid) {
      this.events.emit("order:ready", this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrorsOrder = {};
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    this.formErrorsOrder = errors;
    this.events.emit('formErrorsOrder:change', this.formErrorsOrder);
    return Object.keys(errors).length === 0;
  }

  validateСontact() {
    const errors: typeof this.formErrorsContact = {};
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    this.formErrorsContact = errors;
    this.events.emit('formErrorsContact:change', this.formErrorsContact);
    return Object.keys(errors).length === 0;
  }

  getFormErrorsOrder() {
    return [Object.values(this.formErrorsOrder).join('; ')];
  }

  getFormErrorsContact() {
    return [Object.values(this.formErrorsContact).join('; ')];
  }

  clear() {
    this.order = {
      payment: null,
      email: "",
      phone: "",
      address: "",
      total: 0,
      items: []
    };
    this.events.emit("order:changed");
  }}
