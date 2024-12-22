<template>
  <header>
    <div class="header-top">
      <div class="contact-info">
        <!-- Здесь может быть контактная информация -->
      </div>
      <div class="address">
        <!-- Здесь может быть адрес или другая информация -->
      </div>
    </div>

    <nav class="main-nav">
      <router-link to="/products">Продукты</router-link>
      <router-link to="/categories">Категории</router-link>

      <!-- Ссылка на корзину с выводом количества товаров -->
      <router-link to="/cart">
        Корзина ({{ totalQuantity }})
      </router-link>

      <!-- Если не авторизован, показываем кнопки "Войти" -->
      <div v-if="!isLoggedIn" class="auth-buttons">
        <router-link class="login-button" to="/login">Профиль</router-link>
      </div>

      <!-- Если авторизован, показываем "Профиль" -->
      <router-link v-else to="/profile">Профиль</router-link>

      <!-- Вкладка для администратора -->
      <router-link v-if="isAdmin" to="/admin">Админ Панель</router-link>
    </nav>
  </header>
</template>


<script>
import { computed } from 'vue';
import { cartStore } from '../store.js'; // Пример вашего хранилища (или Pinia/Vuex)

export default {
  name: 'AppHeader',
  setup() {
    // Вычисляем общее количество товаров в корзине
    const totalQuantity = computed(() => {
      return cartStore.cart.reduce((sum, item) => sum + item.quantity, 0);
    });

    // Проверяем, есть ли токен (например, в localStorage)
    const isLoggedIn = computed(() => {
      return !!localStorage.getItem('token');
    });

    // Проверяем, является ли пользователь администратором
    const isAdmin = computed(() => {
      const role = localStorage.getItem('role');
      return role === 'moderator';
    });

    return {
      totalQuantity,
      isLoggedIn,
      isAdmin,
    };
  }
};
</script>


<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 20px;
}

.header-top {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center; /* Выровнять элементы по центру по вертикали */
  padding: 10px 0px;
  background-color: #fff;
  font-size: 14px;
  color: #666;
}

.contact-info,
.address {
  display: flex;
  flex-direction: column;
  white-space: nowrap; /* Запрещает перенос текста */
}

.request-link,
.address a {
  color: blue;
  text-decoration: none;
}
.request-link:hover,
.address a:hover {
  color: blue;
  text-decoration: underline;
}

.logo-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo img {
  max-height: 100px;
  width: auto;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
  width: 80vw; /* Ширина 80% от ширины экрана */
}

.main-nav a {
  width: 100%;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 20px 0;
  background-color: #eaeaea;
  transition: background-color 0.3s;
  text-align: center;
  display: flex;
  align-items: center; 
  justify-content: center;
}

.main-nav a:hover {
  background-color: blue;
  color: #fff;
}

/* Контейнер для кнопок авторизации */
.auth-buttons {
  display: flex;
  gap: 5px;
  width: 100%;
}

.login-button,
.register-button {
  flex: 1; /* чтобы они занимали равное пространство */
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 20px 0;
  background-color: #eaeaea;
  transition: background-color 0.3s;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover,
.register-button:hover {
  background-color: blue;
  color: #fff;
}
</style>
