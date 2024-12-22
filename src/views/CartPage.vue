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
.cart-page {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8f9fa, #e9ecef);
  padding: 40px;
  font-family: "Arial", sans-serif;
}

.cart-page h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #343a40;
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: bold;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.cart-item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-right: 2px solid #dee2e6;
}

.cart-item-info {
  flex: 1;
  padding: 20px;
  position: relative;
}

.cart-item-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #495057;
  font-weight: bold;
}

.cart-item-info .category {
  margin: 10px 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

.cart-item-info .quantity-label {
  display: flex;
  align-items: center;
  margin-top: 15px;
  font-size: 0.9rem;
}

.cart-item-info input {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.cart-item-info input:focus {
  border-color: #007bff;
  outline: none;
}

.delete-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

.cart-footer {
  margin-top: 30px;
  text-align: right;
  font-size: 1.2rem;
  color: #495057;
  font-weight: bold;
}

.checkout-btn {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.checkout-btn:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.empty-cart {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #6c757d;
  font-style: italic;
}
</style>
