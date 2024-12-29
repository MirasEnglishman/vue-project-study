<template>
  <div class="cart-page">
    <h1>Моя корзина</h1>
    <div v-if="cart.length" class="cart-content">
      <!-- Список товаров в корзине -->
      <div class="cart-item" v-for="item in cart" :key="item.product.id">
        <img
          v-if="item.product.images && item.product.images[0]"
          :src="item.product.images[0]"
          alt="Фото"
          class="cart-item-image"
        />
        <div class="cart-item-info">
          <h3>{{ item.product.name }}</h3>
          <p class="category">Категория: {{ item.product.category_name }}</p>
          <label class="quantity-label">
            Количество:
            <input
              type="number"
              v-model.number="item.quantity"
              min="1"
              @change="updateQuantity(item.product.id, item.quantity)"
            />
          </label>
          <button class="delete-btn" @click="removeItem(item.product.id)">
            Удалить
          </button>
        </div>
      </div>

      <!-- Подвал корзины: общие итоги -->
      <div class="cart-footer">
        <p>Всего товаров: {{ totalQuantity }}</p>
        <button class="checkout-btn" @click="checkout">Оформить заказ</button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>Ваша корзина пуста. Добавьте товары, чтобы оформить заказ.</p>
    </div>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from "vue";
import axios from "axios";
import { cartStore } from "../store.js"; // Ваше хранилище

export default {
  name: "CartPage",
  setup() {
    const cart = reactive(cartStore.cart); // Реактивная корзина
    const userId = reactive({ id: null }); // Сохраняем id пользователя

    // Получение текущего пользователя
    const fetchUserId = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT токен
          },
        });

        userId.id = response.data.user.id; // Сохраняем id пользователя
        console.log("User ID:", userId.id);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        // alert("Ошибка авторизации. Пожалуйста, войдите снова.");
      }
    };

    // Удаление товара
    const removeItem = (productId) => {
      cartStore.removeFromCart(productId);
    };

    // Обновление количества
    const updateQuantity = (productId, newQuantity) => {
      cartStore.updateQuantity(productId, newQuantity);
    };

    // Общий подсчёт количества товаров
    const totalQuantity = computed(() =>
      cart.reduce((sum, item) => sum + item.quantity, 0)
    );

    // Метод для оформления заказа
    const checkout = async () => {
      if (!userId.id) {
        alert("Пользователь не авторизован");
        return;
      }

      const todayDate = new Date().toISOString().split("T")[0]; // Текущая дата в формате YYYY-MM-DD

      try {
        // Отправляем заказы для каждого товара в корзине
        for (const item of cart) {
          const orderData = {
            product_id: item.product.id,
            user_id: userId.id,
            date: todayDate,
          };

          // POST запрос на сервер
          await axios.post("/api/orders", orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT токен
            },
          });

          console.log(`Заказ на продукт ${item.product.name} успешно создан`);
        }

        alert("Все заказы успешно оформлены!");
        cartStore.clearCart(); // Очистить корзину после успешного заказа
      } catch (error) {
        console.error("Ошибка при оформлении заказа:", error);
        alert("Ошибка при оформлении заказа. Попробуйте позже.");
      }
    };

    // Загружаем id пользователя при монтировании компонента
    onMounted(() => {
      fetchUserId();
    });

    return {
      cart,
      removeItem,
      updateQuantity,
      totalQuantity,
      checkout,
    };
  },
};
</script>
<style scoped>
/* Базовая обёртка страницы */
.cart-page {
  min-height: 100vh;
  background-color: #f7f7f7; /* Светлый фон */
  padding: 40px 20px;
  font-family: "Open Sans", Arial, sans-serif;
  color: #2c3e50; /* Тёмно-серый */
}

.cart-page h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #34495e;
}

/* Секция с товарами в корзине */
.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff; /* Белая подложка */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Элемент корзины */
.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #ecf0f1;
  padding: 15px 0;
  transition: background-color 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none; /* Убираем нижнюю границу у последнего */
}

.cart-item:hover {
  background-color: #fafafa;
}

/* Изображение товара */
.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

/* Информация о товаре */
.cart-item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cart-item-info h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
}

.cart-item-info .category {
  margin-top: 5px;
  font-size: 0.95rem;
  color: #95a5a6;
  font-style: italic;
}

/* Блок изменения количества */
.quantity-label {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  color: #2c3e50;
}

.quantity-label input {
  width: 60px;
  margin-left: 8px;
  padding: 6px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  text-align: center;
  color: #2c3e50;
  transition: border-color 0.3s;
}

.quantity-label input:focus {
  border-color: #3498db;
}

/* Кнопка "Удалить товар" */
.delete-btn {
  margin-top: 10px;
  padding: 8px 14px;
  background-color: #e74c3c;
  color: #fff;
  font-size: 0.95rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s, transform 0.3s;
}

.delete-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Подвал корзины (итог) */
.cart-footer {
  margin-top: 20px;
  text-align: right;
  font-size: 1.1rem;
  color: #34495e;
  font-weight: 600;
}

.checkout-btn {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.checkout-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

/* Пустая корзина */
.empty-cart {
  text-align: center;
  margin-top: 60px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #7f8c8d;
}
</style>
