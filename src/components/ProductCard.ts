import { IProduct } from "../types";
import { ensureElement, formatNumber } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class ProductCard extends Component<IProduct> {
  element: HTMLElement;
  private title: HTMLElement;
  private price: HTMLElement;
  private image?: HTMLImageElement;
  private decription?: HTMLElement;
  private category?: HTMLElement;
  private addButton?: HTMLButtonElement;
  private removeButton?: HTMLButtonElement;
  private itemIndex?: HTMLElement;
  private id: string;
  private events: IEvents;
  private readonly colorCategory?: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
  }

  constructor(template: HTMLElement, events: IEvents) {
    super(template);
    this.events = events;
    this.element = template;

    this.title = ensureElement<HTMLElement>(".card__title", this.element);
    this.price = ensureElement<HTMLElement>(".card__price", this.element);
    this.image = ensureElement<HTMLImageElement>(".card__image", this.element);
    this.decription = ensureElement<HTMLElement>(".card__text", this.element);
    this.category = ensureElement<HTMLElement>(".card__category", this.element);
    this.addButton = ensureElement<HTMLButtonElement>(".button", this.element);
    this.removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.element);
    this.itemIndex = ensureElement<HTMLElement>(".basket__item-index", this.element);

    this.element.addEventListener("click", () => {
      if (this.element.classList.contains("gallery__item")) {
        this.events.emit("product:click", {id: this.id});
      }
    });

    this.addButton?.addEventListener("click", () => {
      this.events.emit("basket:add", {id: this.id});
      this.setDisabled(this.addButton, true);
      this.setText(this.addButton, "Добавлено");
    });

    this.removeButton?.addEventListener("click", () => {
      this.events.emit("basket:remove", {id: this.id});
    });
  }

  setData(data: IProduct): void {
    this.id = data.id;
    this.setText(this.title, data.title);
    this.setText(this.price, data.price? `${formatNumber(data.price)} синапсов` : "Бесценно");
    this.setImage(this.image, data.image, data.title);
    this.setText(this.decription, data.description)
    this.setText(this.category, data.category);
    this.category?.classList.add(this.colorCategory[data.category]);
    this.setText(this.itemIndex, String(data.itemIndex));
  }

  updateButtonState(price: number | null, isInBasket: boolean) {
    if (price === null) {
      this.setDisabled(this.addButton, true);
      this.setText(this.addButton, "Недоступно");
    } else if (isInBasket) {
      this.setDisabled(this.addButton, true);
      this.setText(this.addButton, "Добавлено");
    } else {
      this.setDisabled(this.addButton, false);
      this.setText(this.addButton, "В корзину");
    }
  }

  get cardId() {
    return this.id;
  }

  removeProduct() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
