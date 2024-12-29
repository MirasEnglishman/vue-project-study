<template>
  <div class="categories-page">
    <h1>Категории</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else class="categories-list">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        @click="goToCategory(category)"
      >
        <img
          :src="category.image"
          alt="Category image"
          class="category-image"
        />
        <h3>{{ category.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CategoriesPage",
  data() {
    return {
      categories: [],
      loading: true,
    };
  },
  methods: {
    fetchCategories() {
      axios
        .get("http://127.0.0.1:8000/api/categories") // Предполагаемый URL для получения данных
        .then((response) => {
          this.categories = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          this.loading = false;
        });
    },
    goToCategory(category) {
      // Перенаправляем на страницу продуктов с параметром фильтра по категории
      this.$router.push({
        name: "Products",
        query: { category: category.id },
      });
    },
  },
  created() {
    this.fetchCategories();
  },
};
</script>


<style scoped>
/* Базовые стили для всей страницы */
.categories-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #f5f6fa; /* Светло-серый фон */
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #2f3640; /* Тёмный цвет для текста */
}

.categories-page h1 {
  font-size: 2.2rem;
  margin-bottom: 40px;
  font-weight: 700;
  color: #2f3640;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

/* Состояние загрузки */
.categories-page div[ v-if="loading" ] {
  font-size: 1.5rem;
  color: #718093;
  margin-top: 40px;
  text-align: center;
}

/* Сетка категорий */
.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Карточки категорий */
.category-card {
  background-color: #fff; /* Белая подложка */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Лёгкий тень */
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  padding: 20px;
}

.category-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

/* Изображение категории */
.category-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 15px;
  transition: transform 0.3s;
}

.category-card:hover .category-image {
  transform: scale(1.05);
}

/* Название категории */
.category-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2f3640;
  text-transform: capitalize;
  margin: 0;
}

/* Дополнительные эффекты (можно отключить, если не нужен оверлей) */
.category-card::before {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(52, 152, 219, 0.1) 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover::before {
  opacity: 1;
}
</style>
