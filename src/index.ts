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

const api = new ShopAPI(CDN_URL, API_URL)
const events = new EventEmitter();

// Глобальные контейнеры
// const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketElem = ensureElement<HTMLElement>('.header__basket'); // Вынести в класс Page
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter'); // Вынести в класс Page

basketElem.addEventListener('click', () => { // Вынести в класс Page
  events.emit('basket:open');
});

// Инициализация модели данных
const productData = new ProductData(events);
const orderData = new OrderData(events);

// Инициализация компонентов
const catalogSection = ensureElement<HTMLElement>('.gallery')
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Изменение каталога товаров
events.on('products:changed', () => {
  catalogSection.innerHTML = '';
  productData.getProducts().forEach(product => {
    const productCard = new ProductCard(cloneTemplate(cardCatalogTemplate), events);
    productCard.setData(product);
    catalogSection.append(productCard.element);
  });
  console.log('Товары изменены');
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
  basketCounter.textContent = productData.getBasket().length.toString(); // Вынести в класс Page
});

// Открытие корзины
events.on('basket:open', () => {
  modal.render({ content: basket.render({}) });
  modal.open();
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
