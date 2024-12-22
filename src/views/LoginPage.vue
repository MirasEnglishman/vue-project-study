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
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
}

.login-page h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #343a40;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.login-button:active {
  background-color: #003d82;
}

.register-link {
  margin-top: 20px;
  font-size: 1rem;
  color: #6c757d;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
