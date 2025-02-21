import { IOrderForm } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IOrderForm> {
  private paymentCard: HTMLButtonElement;
  private paymentCash: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.paymentCard = this.container.elements.namedItem('card') as HTMLButtonElement;
    this.paymentCash = this.container.elements.namedItem('cash') as HTMLButtonElement;

    this.paymentCard.addEventListener('click', () => this.payment = 'card');
    this.paymentCash.addEventListener('click', () => this.payment = 'cash');
  }


  set payment(value: string | null) {
    this.toggleClass(this.paymentCard, 'button_alt-active', value === 'card');
    this.toggleClass(this.paymentCash, 'button_alt-active', value === 'cash');
    if (value) {
      this.events.emit('order:payment', {payment: value});
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class Contacts extends Form<IOrderForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}
