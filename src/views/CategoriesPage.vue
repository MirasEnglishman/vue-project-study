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
.categories-page {
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
}

.categories-page h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #343a40;
  text-transform: uppercase;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  justify-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  width: 250px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.category-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.category-card h3 {
  margin-top: 10px;
  font-size: 1.5em;
  color: #495057;
  text-transform: capitalize;
}

.category-card h3:hover {
  color: #007bff;
}

</style>
