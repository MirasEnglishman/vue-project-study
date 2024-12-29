<template>
  <div class="register-page">
    <h1>Регистрация</h1>
    <form class="register-form" @submit.prevent="handleRegister">
      <div class="form-group">
        <label> Имя:
          <input type="text" v-model="name" required />
        </label>
      </div>
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
      <button type="submit" class="register-button">Зарегистрироваться</button>
    </form>

    <!-- Ссылка на логин -->
    <p class="login-link">
      Уже есть аккаунт? <router-link to="/login">Войти</router-link>
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "RegisterPage",
  setup() {
    const router = useRouter();
    const name = ref("");
    const email = ref("");
    const password = ref("");

    // Обработка нажатия кнопки "Зарегистрироваться"
    const handleRegister = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/register", {
          name: name.value,
          email: email.value,
          password: password.value,
        });
        const token = response.data.token;

        localStorage.setItem("token", token);

        alert("Регистрация прошла успешно!");
        router.push("/profile");
      } catch (error) {
        alert("Ошибка при регистрации!");
        console.error(error);
      }
    };

    return {
      name,
      email,
      password,
      handleRegister,
    };
  },
};
</script>

<style scoped>
/* Общий контейнер страницы */
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;         /* Заполняем всю высоту экрана */
  background-color: #1e1e2f; /* Тёмный фон */
  font-family: "Ubuntu", sans-serif;
  color: #f5f6fa;            /* Светлый цвет текста */
}

/* Заголовок страницы */
.register-page h1 {
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #00ffcc; /* Неоновый акцент */
}

/* Форма регистрации */
.register-form {
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
  width: 94%;               /* Слегка уменьшаем ширину, чтобы не "прилипал" к краям */
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

/* Кнопка регистрации */
.register-button {
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

.register-button:hover {
  background-color: #00caa3; /* Тёмно-бирюзовый при наведении */
  transform: translateY(-2px);
}

.register-button:active {
  background-color: #00a689; /* Ещё более тёмный акцент при клике */
}

/* Ссылка на логин, если уже есть аккаунт */
.login-link {
  margin-top: 20px;
  font-size: 1rem;
  color: #7f8fa6;
  text-align: center;
}

.login-link a {
  color: #00ffcc;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #00caa3;
  text-decoration: underline;
}
</style>
