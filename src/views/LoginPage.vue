<template>
  <div class="login-page">
    <h1>Авторизация</h1>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label> Email:
          <input type="email" v-model="email" required />
        </label>
      </div>
      <div class="form-group">
        <label> Пароль:
          <input type="password" v-model="password" required />
        </label>
      </div>
      <button type="submit" class="login-button">Войти</button>
    </form>

    <p class="register-link">
      Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
  try {
    console.log('DEBUG | handleLogin()');
    console.log('DEBUG | email:', email.value);
    console.log('DEBUG | password:', password.value);

    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value,
    });

    console.log('DEBUG | response:', response);

    const { token, role } = response.data; // Получаем токен и роль из ответа
    if (!token) {
      console.error('DEBUG | Токен или роль не найдены в ответе сервера:', response.data);
      alert('Ошибка: сервер не вернул токен или роль!');
      return;
    }

    // Сохраняем токен и роль в localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    alert('Успешная авторизация!');

    // Переход на страницу профиля
    router.push('/profile').then(() => {
      window.location.reload(); // Перезагрузка страницы после успешного перехода
    });
  } catch (error) {
    console.error('DEBUG | Ошибка авторизации:', error);

    if (error.response) {
      console.error('DEBUG | error.response.data:', error.response.data);
      console.error('DEBUG | error.response.status:', error.response.status);
      console.error('DEBUG | error.response.headers:', error.response.headers);
    }

    alert('Ошибка авторизации!');
  }


};


    return {
      email,
      password,
      handleLogin,
    };
  },
};
</script>
<style scoped>
/* Общий контейнер страницы */
.login-page {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1e1e2f; /* Тёмный фон */
  font-family: "Ubuntu", sans-serif;
  color: #f5f6fa; /* Светлый цвет текста */
}

/* Заголовок страницы */
.login-page h1 {
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #00ffcc; /* Неоновый акцент */
}

/* Форма авторизации */
.login-form {
  width: 100%;
  max-width: 360px;
  padding: 30px 25px;
  background-color: #2f3640; /* Тёмно-серый блок */
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* Обёртка для поля (лейбл + инпут) */
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

/* Текст лейбла */
.form-group label {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #dcdde1;
}

/* Поле ввода */
.form-group input {
  width: 94%;
  padding: 10px;
  font-size: 1rem;
  color: #f5f6fa;
  background-color: #353b48; /* Тёмный фон инпута */
  border: 2px solid #353b48;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

/* Фокус на поле ввода */
.form-group input:focus {
  outline: none;
  border-color: #00ffcc; /* Неоновый цвет при фокусе */
}

/* Кнопка авторизации */
.login-button {
  width: 100%;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e1e2f;
  background-color: #00ffcc; /* Основной неоновый акцент */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-button:hover {
  background-color: #00caa3; /* Тёмно-бирюзовый при наведении */
  transform: translateY(-2px);
}

.login-button:active {
  background-color: #00a689; /* Ещё более тёмный акцент при клике */
}

/* Ссылка на регистрацию */
.register-link {
  margin-top: 20px;
  font-size: 1rem;
  color: #7f8fa6;
  text-align: center;
}

.register-link a {
  color: #00ffcc;
  text-decoration: none;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #00caa3;
  text-decoration: underline;
}
</style>
