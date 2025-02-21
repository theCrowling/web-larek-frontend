# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных.
### Карточка товара
```
interface IProduct {
  readonly id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  description: string;
  itemIndex?: number;
}
```
### Заказ
```
interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

interface IOrder extends IOrderForm {
  total: number;
  items: string[];
}
```
### Типы данных
Товары в корзине
```
type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
```
Форма ошибок полей
```
type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```

## Архитектура приложения
Архитектура проекта разрабатывается с использованием паттерна MVP, где основные слои:
- Модель - для хранения и обмена данными,
- Отображение - для вывода данных на экран,
- Презентер - для связи модели с отображением.

Презентер не будет выделен в отдельный класс, а будет находится в файле `./scr/index.ts`.

### Базовый код
#### Класс ShopAPI
Осуществляет взаимодействие с сервером, получение товаров и отправка оформленного заказа.\
Конструктор принимает параметры:
- `cdn` - cdn сервера,
- `baseUrl` - адрес сервера,

Методы класса:
- `getProducts(): Promise<IProduct[]>` — получение каталога товаров.
- `getProduct(id: string): Promise<IProduct>` — получение товара по id.
- `postOrder(order: IOrder): Promise<IOrderResult>` — отправка заказа на сервер.

#### Класс EventEmitter
Брокер событий для отправки событий и подписки на них. Используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Класс имеет методы:
- `on` - для подписки на событие,
- `off` - для отписки от события,
- `emit`  — для уведомления подписчиков о наступлении события.
- `trigger` - генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

### Слой модели.
#### Класс ProductData
Класс отвечает за хранение данных о товарах и логику работы с корзиной товаров.\
Поля класса хранят данные:
- `products: IProduct[]` - каталог товаров.
- `basket: IProduct[]` - корзина с товаром.
- `events: IEvents` - экземпляр класса EventEmitter, для инициализации событий.

Методы класса:
- `setProducts(products: IProduct[]): void` - установка каталога товаров.
- `getProducts(): IProduct[]` - получение каталога товаров.
- `getProduct(id: string): IProduct` - получение товара по идентификатору.
- `addItem(id: string): void` - добавление в корзину по идентификатору.
- `removeItem(id: string): void` - удаление из корзины по идентификатору.
- `isInBasket(id: string): boolean` - проверка наличия товара в корзине.
- `updateIndexes(): number` - обновление индексов товара в корзине.
- `getBasket(): IProduct[]` - получение корзины товаров.
- `getTotal(): number;` - получение суммы товаров в корзине.
- `clearBasket(): void` - очистка корзины.

#### Класс OrderData
Класс отвечает за хранение данных о заказе и обработку действий с формами.\
Поля класса хранят данные:
- `order: IOrder;`  - данные заказа.
- `formErrorsOrder: FormErrors` - ошибки валидации полей формы заказа.
- `formErrorsContact: FormErrors` - ошибки валидации полей формы контактов.
- `events: IEvents` - экземпляр класса EventEmitter, для инициализации событий.

Методы класса:
- `set items(items: string[])` - установка списка товаров в заказ.
- `set total(total: number)` - установка суммы заказа.
- `getOrder(): IOrder` - получение данных заказа.
- `setOrderField(field: keyof IOrderForm, value: string)` - проверка данных в полях формы для последующей валидации.
- `validateOrder(): boolean` - валидация полей заказа.
- `validateСontact(): boolean` - валидация полей контактов.
- `getFormErrorsOrder(): FormErrors` - получение ошибок валидации полей заказа.
- `getFormErrorsContact(): FormErrors` - получение ошибок валидации полей контактов.
- `clear(): void` - очистка заказа.

### Слой представления.
Все классы представления наследуются от `Component.ts`, который реализует базовый функционал для создания компонентов.

#### Класс Page
Класс управляет отображением каталога товаров и корзины.
- `constructor(container: HTMLElement, protected events: IEvents)` - конструктор класса, принимает контейнер главной страницы и обработчик клика на корзину.

Поля класса:
- `catalog: HTMLElement` - контейнер каталога товаров,
- `basket: HTMLElement` - контейнер корзины,
- `count: HTMLElement` - количество товаров в корзине,
- `wrapper: HTMLElement` - контейнер главной страницы для блокировки прокрутки страницы.

Методы класса:
- Сеттеры и геттеры для работы с данными товара.

#### Класс ProductCard
Класс отображает карточку товара в различных вариациях и генерирует события с помощью брокера событий.
- `constructor(template: string, events: IEvents)` - конструктор класса, принимает темплейт элемента, что позволяет передать разные варианты отображения, так же принимает брокер для генерации событий.

Поля класса:
- `element: HTMLElement` - контейнер карточки товара,
- `title: HTMLElement` - заголовок товара,
- `price: HTMLElement` - цена товара,
- `image?: HTMLImageElement` - изображение товара,
- `decription?: HTMLElement` - описание товара,
- `addButton?: HTMLButtonElement` - кнопка добавления товара в корзину,
- `removeButton?: HTMLButtonElement` - кнопка удаления товара из корзины,
- `id: string` - идентификатор товара,
- `itemIndex?: number` - порядковый номер товара,
- `colorCategory?: Record <string, string>` - цвет категории товара,

Методы класса:
- `setData(data: IProduct, isInBasket?: boolean): void` - установка данных товара,
- `updateButtonState(price: number | null, isInBasket: boolean)` - обновление состояния кнопок.

#### Класс Modal
Данный класс реализует универсальное модальное окно с методами `open` и `close` для управления отображением модального окна.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор класса, принимает контейнер модального окна и экземпляр класса EventEmitter для генерации событий.

Необходимые поля класса:
- `content: HTMLElement` - разметка помещаемая в модальное окно,
- `closeButton: HTMLButtonElement` - кнопка закрытия модального окна,

#### Класс Basket
Данный класс реализует корзину товаров и управляет содержимым.
- `constructor(container: HTMLElement, events: IEvents)`

Необходимые поля класса:
- `list: HTMLElement` - контейнер списка товаров в корзине,
- `total: HTMLElement` - элемент отображения суммы товаров,
- `orderButton: HTMLButtonElement` - кнопка оформления заказа,

Методы класса:
- `set items(items: HTMLElement[])` - установка списка товаров в корзине,
- `set total(total: number)` - установка суммы товаров в корзине,

#### Класс Form
Данный класс базовый для обработки форм в проекте. Он управляет валидацией полей и отображением ошибок.
- `constructor(container: HTMLFormElement, events: IEvents)`

Необходимые поля класса:
- `submit: HTMLButtonElement` - кнопка отправки формы,
- `errors: HTMLElement` - контейнер ошибок.

Методы класса:
- `set valid(value: boolean)` -	включает/отключает кнопку отправки.
- `set errors(value: string)`	-	отображает ошибки валидации.
- `render(state: Partial<T> & IForm)` - обновляет состояние формы.

#### Класс Order
Класс расширяет Form и добавляет поддержку полей: способ оплаты, адрес.
- `constructor(container: HTMLFormElement, events: IEvents)`

Методы класса:
- `set payment(value: string | null)` -  устанавливает способ оплаты.
- `set address(value: string)` -  устанавливает адрес.

#### Класс Contacts
Класс расширяет Form и добавляет поддержку полей: телефон и email.
- `constructor(container: HTMLFormElement, events: IEvents)`

Методы класса:
- `set phone(value: string)` -  устанавливает телефон.
- `set email(value: string)` -  устанавливает email.

#### Класс Success
Класс отображает сообщение об успешной покупке.
- `constructor(container: HTMLElement, actions: ISuccessActions)`

Поля класса:
- `close: HTMLElement` - кнопка закрытия сообщения.
- `total: HTMLElement;` - сумма заказа.

### Взаимодействие
Взаимодействие между классами реализовано через события генерируемые брокером событий. И обработчики этих событий описанных в `src/index.ts`

#### Список всех событий:
События изменения данных:
- `products:changed` - изменение каталога товара,
- `basket:changed` - изменение корзины,
- `order:changed` - обновление и валидация данных заказа,
- `order:submit` - изменение данных заказа,
- `contacts:submit` - отправка формы заказа,

События при взаимодействии с интерфейсом:
- `product:click` - клик на карточку товара,
- `modal:open` - открытие модального окна,
- `modal:close` - закрытие модального окна,
- `basket:add` - добавление товара в корзину,
- `basket:remove` - удаление товара из корзины,
- `basket:open` - открытие корзины,
- `order:open` - открытие формы заказа,
- `order:payment` - изменение способа оплаты,
