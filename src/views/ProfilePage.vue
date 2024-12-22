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
    min-height: 80vh;
    padding: 20px;
    margin: 0 auto;
    max-width: 600px;
  
    /* Градиентный фон */
    background: linear-gradient(135deg, #eef2f3, #8e9eab);
    border-radius: 12px;
  
    /* Выравнивание содержимого по центру */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  /* Заголовок */
  .profile-page h1 {
    font-family: 'Roboto', sans-serif;
    font-size: 2em;
    margin-bottom: 30px;
    color: #333;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  }
  
  /* Карточка с профилем */
  .profile-card {
    width: 100%;
    max-width: 400px;
    background-color: #ffffffcc; /* белый с небольшой прозрачностью */
    backdrop-filter: blur(5px);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    text-align: center;
    animation: fadeIn 0.4s ease;
  }
  
  .profile-card p {
    margin: 10px 0;
    font-size: 1.1em;
    color: #444;
  }
  
  /* Кнопка «Выйти» */
  .logout-button {
    background-color: #f44336;
    color: #fff;
    padding: 10px 20px;
    margin-top: 15px;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-button:hover {
    background-color: #c5382f;
  }
  
  /* Контейнер для спиннера и текста «Загрузка...» */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  /* Спиннер */
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ccc; /* серые грани */
    border-top: 4px solid #777; /* более тёмная грань сверху */
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  /* Анимация вращения спиннера */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Плавное появление содержимого */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  