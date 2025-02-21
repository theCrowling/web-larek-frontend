import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected list: HTMLElement;
  protected _total: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.list = ensureElement<HTMLElement>(".basket__list", this.container);
    this._total = this.container.querySelector(".basket__price");
    this.orderButton = this.container.querySelector(".button");

    if (this.orderButton) {
      this.orderButton.addEventListener("click", () => {
        events.emit("order:open");
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
    } else {
      this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста, добавьте что нибудь'
      }));
    }
  }

  set total(total: number) {
    this.setText(this._total, `${formatNumber(total)} синапсов`);
    this.setDisabled(this.orderButton, total === 0);
  }
}
