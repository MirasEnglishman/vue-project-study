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
      <router-link to="/products">Товары</router-link>
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


/* Общие стили для всего заголовка */
header {
  width: 100%;
  background-color: #2c2c54; /* Тёмно-фиолетовый фон */
  color: #f1f1f1;           /* Светлый текст */
  font-family: "Roboto", Arial, sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* Верхняя полоса (контактная информация, адрес и т.д.) */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1e1e3f; /* Ещё более тёмный оттенок для верхней полосы */
  font-size: 0.9rem;
  color: #dcdde1;
}

/* Мелкие элементы внутри верхней полосы */
.contact-info,
.address {
  display: flex;
  gap: 10px;
  align-items: center;
}
.contact-info a,
.address a {
  color: #a29bfe;
  text-decoration: none;
  transition: color 0.3s;
}
.contact-info a:hover,
.address a:hover {
  color: #f5f6fa;
}

/* Основная навигация */
.main-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 15px 0;
  background-color: #2c2c54;
}

/* Ссылки в основном меню */
.main-nav a {
  color: #f1f1f1;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s;
}

.main-nav a::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #a29bfe; /* Светлый акцентный цвет */
  transition: width 0.3s, left 0.3s;
}

.main-nav a:hover {
  color: #a29bfe;
}
.main-nav a:hover::before {
  width: 100%;
  left: 0;
}

/* Блоки, зависящие от авторизации */
.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Кнопки авторизации */
.login-button,
.register-button {
  /* background-color: #3c3c8a; */
  color: #f1f1f1;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 40px;
  border-radius: 20px;
  transition: background-color 0.3s, transform 0.3s;
}

.login-button:hover,
.register-button:hover {
  /* background-color: #504f9d; */
  transform: translateY(-2px);
}

/* Адаптивность: уменьшаем отступы на маленьких экранах */
@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 10px;
  }
  .main-nav {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
