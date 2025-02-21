import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ShopAPI } from './components/ShopAPI';
import { ProductData } from './components/ProductData';
import { EventEmitter } from './components/base/events';
import { OrderData } from './components/OrderData';
import { ProductCard } from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Page } from './components/Page';
import { Contacts, Order } from './components/Order';
import { FormErrors, IOrderForm } from './types';
import { Success } from './components/common/Success';

const api = new ShopAPI(CDN_URL, API_URL)
const events = new EventEmitter();

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация модели данных
const productData = new ProductData(events);
const orderData = new OrderData(events);

// Инициализация компонентов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Изменение каталога товаров
events.on('products:changed', () => {
  const products = productData.getProducts().map(product => {
    const productCard = new ProductCard(cloneTemplate(cardCatalogTemplate), events);
    productCard.setData(product);
    return productCard.element;
  });
  page.catalog = products;
});

// Открытие товара в модальном окне
events.on('product:click', ({id}: {id: string}) => {
  const product = productData.getProduct(id);
  const isInBasket = productData.isInBasket(id);
  const productCardModal = new ProductCard(cloneTemplate(cardPreviewTemplate), events);
  productCardModal.setData(product);
  productCardModal.updateButtonState(product.price, isInBasket);

  modal.render({content: productCardModal.element})
  console.log("Модальное окно открыто с товаром:", product);
});

// Добавление товара в корзину
events.on('basket:add', ({id}: {id: string}) => {
  productData.addItem(id);
});

// Удаление товара из корзины
events.on('basket:remove', ({id}: {id: string}) => {
  productData.removeItem(id);
});

// Обновление корзины
events.on('basket:changed', () => {
  const basketItems = productData.getBasket().map(product => {
    const productCardBasket = new ProductCard(cloneTemplate(cardBasketTemplate), events);
    productCardBasket.setData(product);
    console.log('Элемент корзины:', productCardBasket.element);
    return productCardBasket.element
  });

  basket.render({items: basketItems, total: productData.getTotal()});
  page.counter = productData.getBasket().length;
});

// Открытие корзины
events.on('basket:open', () => {
  modal.render({ content: basket.render({}) });
});

// Открытие формы заказа
events.on('order:open', () => {
  orderData.clear();
  orderData.items = productData.getBasket().map(product => product.id);
  orderData.total = productData.getTotal();

  modal.render({
    content: order.render({
      ...orderData.getOrder(),
      valid: orderData.validateOrder(),
      errors: orderData.getFormErrorsOrder(),
    }),
  });
});

// Открытие формы контактов
events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
      ...orderData.getOrder(),
      valid: orderData.validateСontact(),
      errors: orderData.getFormErrorsContact(),
    }),
  });
});

// Отправка формы заказа
events.on('contacts:submit', () => {
  console.log("Текущий заказ:", orderData.getOrder());
  api.postOrder(orderData.getOrder())
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        },
      });
      modal.render({ content: success.render({total: result.total}) });
      productData.clearBasket();
      console.log("Заказ успешно отправлен:", result)
    })
    .catch((err) => {
      console.error("Ошибка при отправке заказа:", err);
      contacts.errors = (`Ошибка при отправке заказа: ${err}`);
    })
});

// Изменение способа оплаты
events.on("order:payment", ({payment}: {payment: string | null}) => {
  orderData.setPayment(payment);
});


events.on('formErrorsOrder:change', (errors: Partial<FormErrors>) => {
  console.log("🔥 Ошибки формы оплаты обновились:", errors);
  const { payment, address } = errors;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
  order.valid = !payment && !address;
})


events.on('formErrorsContact:change', (errors: Partial<FormErrors>) => {
  console.log("🔥 Ошибки формы контактов обновились:", errors);
  const { email, phone } = errors;
  contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
  contacts.valid = !email && !phone;
})

// Поля первого экрана (способ оплаты, адрес)
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  orderData.setOrderField(data.field, data.value);
});

// Для отслеживания изменений в данных заказа (потом удалить)
events.on('order:changed', () => {
  orderData.validateOrder()
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Получаем товары с сервера
api.getProducts()
    .then(result => {
        productData.setProducts(result);
        console.log('Получено с сервера:', result);
        productData.addItem(result[6].id);
        productData.addItem(result[7].id);
    })
    .catch(err => {
        console.error(err);
    });
