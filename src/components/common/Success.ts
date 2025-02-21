import { IOrderResult } from "../../types";
import { ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<IOrderResult> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
      super(container);

      this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
      this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

      if (actions?.onClick) {
          this._close.addEventListener('click', actions.onClick);
      }
  }

  set total(total: number) {
      this.setText(this._total, `Списано ${formatNumber(total)} синапсов`);
  }
}
