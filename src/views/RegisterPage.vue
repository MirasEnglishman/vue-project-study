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
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
}

.register-page h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #343a40;
}

.register-form {
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

.register-button {
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

.register-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.register-button:active {
  background-color: #003d82;
}

.login-link {
  margin-top: 20px;
  font-size: 1rem;
  color: #6c757d;
  text-align: center;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
