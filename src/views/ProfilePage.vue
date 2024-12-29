<template>
    <div class="profile-page">
      <h1>Профиль</h1>
  
      <!-- Если идёт загрузка данных — показываем "Загрузка..." и спиннер -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>
  
      <!-- Если загрузка завершена и user не пустой — показываем профиль -->
      <div v-else-if="user" class="profile-card">
        <p><strong>Имя:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Роль:</strong> {{ role }}</p>
        <button class="logout-button" @click="logout">Выйти</button>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter();

    const user = ref(null);
    const role = ref(''); // Новая переменная для роли
    const loading = ref(false); // флаг загрузки

    onMounted(async () => {
      // При каждом входе на страницу профиля сбрасываем прошлые данные
      user.value = null;
      role.value = ''; // Сбрасываем роль

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        try {
          loading.value = true; // начинаем загрузку

          // Получаем профиль, указывая заголовок Authorization
          const response = await axios.get('http://127.0.0.1:8000/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          user.value = response.data.user; // Получаем данные пользователя
          role.value = response.data.role; // Получаем роль
        } catch (error) {
          console.error('Ошибка при запросе профиля:', error);
          localStorage.removeItem('token');
          router.push('/login');
        } finally {
          loading.value = false; // заканчиваем загрузку
        }
      }
    });

    const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.reload(); // Перезагрузка страницы
};


    return {
      user,
      role,
      loading,
      logout,
    };
  },
};
</script>
<style scoped>
/* Общий контейнер страницы */
.profile-page {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f5f5; /* Светлый нейтральный фон */
  font-family: "Poppins", sans-serif;
  color: #333; /* Темный цвет для текста */
}

/* Заголовок */
.profile-page h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  text-transform: uppercase;
  text-align: left; /* Выравниваем заголовок по левому краю */
}

/* Контейнер загрузки */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  text-align: center;
}

.loading-container p {
  font-size: 1.1rem;
  margin-top: 10px;
  color: #555;
}

/* Спиннер */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #666;
  border-radius: 50%;
  animation: rotate 1s infinite linear;
  margin: 0 auto;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* Карточка профиля */
.profile-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  margin-top: 20px;
}

.profile-card p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #555;
}

/* Кнопка выхода */
.logout-button {
  margin-top: 20px;
  background-color: #e74c3c; /* Красный цвет */
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.logout-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}
</style>
