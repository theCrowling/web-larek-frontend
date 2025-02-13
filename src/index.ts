import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ShopAPI } from './components/ShopAPI';
import { ProductData } from './components/ProductData';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { OrderData } from './components/OrderData';

const api = new ShopAPI(CDN_URL, API_URL)
const events = new EventEmitter();
const productData = new ProductData(events);
const orderData = new OrderData(events);


// Получаем товары с сервера
api.getProducts()
    .then(result => {
        console.log('Выводим в индекс:', result);
        productData.setProducts(result);
        console.log('Выводим из модели:', productData.getProducts());
        productData.addItem(result[1].id);
        productData.addItem(result[3].id);
        console.log('Выводим корзину:', productData.getBasket());
        console.log('Общая сумма:', productData.getTotal());
        orderData.setOrder({
          payment: "Картой",
          email: "test@example.com",
          phone: "89001234567",
          address: "Санкт-Петербург, ул. Пушкина дом колотушкина",
          total: productData.getTotal(),
          items: productData.getBasket().map(product  => product.id),
        });
        console.log("Текущий заказ:", orderData.getOrder());
        api.postOrder(orderData.getOrder())
          .then((result) => console.log("Заказ успешно отправлен:", result))
          .catch((err) => console.error("Ошибка при отправке заказа:", err));


    })
    .catch(err => {
        console.error(err);
    });

//Ниже кусок для теста 1 карточки
/*let item = {
    id: '854cef69-976d-4c2a-a18c-2aa45046c390',
    title: '111',
    image: '11',
    price: 11,
    category: '33',
    description: '22222'
}

api.getProduct(item.id)
.then((result) => {
    item.description = result.description;
    item.title = result.title;
    item.price = result.price;
    console.log('Заголовок:', result.title);
    console.log('Описание:', result.description);
    console.log('Цена:', result.price);
})
.catch((err) => {
    console.error(err);
})*/

