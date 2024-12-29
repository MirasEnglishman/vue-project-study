<template>
  <div class="product-page">
    <h1>Список товаров</h1>

    <!-- Фильтр, поиск и сортировка -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Поиск товаров"
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-filter">
        <option value="">Все категории</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>
      <select v-model="sortOrder" class="sort-filter">
        <option value="asc">Цена: по возрастанию</option>
        <option value="desc">Цена: по убыванию</option>
      </select>
    </div>

    <!-- Блок загрузки -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Список товаров -->
    <div v-else class="product-list">
      <div
        class="product-card"
        v-for="product in filteredProducts"
        :key="product.id"
        @click="showProductDetails(product)"
      >
        <img
          v-if="product.images && product.images.length"
          :src="product.images[0]"
          alt="Фото товара"
        />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">Цена: {{ product.price }} KZT</p>
        <p class="category">Категория: {{ product.category_name }}</p>
      </div>
    </div>

    <!-- Модальное окно для детального просмотра товара -->
    <div
      class="product-modal"
      v-if="selectedProduct"
      @click.self="closeModal"
    >
      <div class="product-modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>

        <h2>{{ selectedProduct.name }}</h2>

        <!-- СЛАЙДЕР ИЗОБРАЖЕНИЙ -->
        <div
          class="slider"
          v-if="selectedProduct.images && selectedProduct.images.length"
        >
          <button class="slider-arrow left" @click.stop="prevImage">&laquo;</button>
          <img
            class="slider-image"
            :src="selectedProduct.images[selectedImageIndex]"
            alt="Фото товара"
          />
          <button class="slider-arrow right" @click.stop="nextImage">&raquo;</button>
        </div>

        <p>{{ selectedProduct.description }}</p>
        <p>Категория: {{ selectedProduct.category_name }}</p>
        <p class="price">Цена: {{ selectedProduct.price }} KZT</p>

        <!-- Выбор количества и добавление в корзину -->
        <div class="add-to-cart">
          <label>
            Количество:
            <input type="number" v-model.number="desiredQuantity" min="1" />
          </label>
          <button @click="addToCart">В корзину</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { cartStore } from "../store.js";

export default {
  name: "ProductPage",
  data() {
    return {
      products: [],
      categories: [],
      loading: true,
      searchQuery: "",
      selectedCategory: "",
      sortOrder: "asc",
      selectedProduct: null,
      selectedImageIndex: 0,
      desiredQuantity: 1,
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;
      const categoryId = this.$route.query.category;

      // Фильтрация по строке поиска
      if (this.searchQuery) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Фильтрация по категории из URL или выбранной категории
      if (categoryId || this.selectedCategory) {
        const selectedCategory =
          this.selectedCategory ||
          this.categories.find((cat) => cat.id == categoryId)?.name;
        filtered = filtered.filter(
          (product) => product.category_name === selectedCategory
        );
      }

      // Сортировка по цене
      filtered = filtered.sort((a, b) =>
        this.sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );

      return filtered;
    },
  },
  methods: {
    async fetchProducts() {
      try {
        // Загрузка категорий и продуктов
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products"),
          axios.get("http://127.0.0.1:8000/api/categories"),
        ]);

        this.categories = categoriesResponse.data;

        this.products = productsResponse.data.map((product) => {
          let parsedImages = [];
          try {
            parsedImages = product.images ? JSON.parse(product.images) : [];
          } catch (err) {
            console.error("Ошибка парсинга поля images:", err);
          }

          return {
            ...product,
            images: parsedImages,
            category_name:
              this.categories.find(
                (category) => category.id === product.category_id
              )?.name || "Неизвестно",
          };
        });

        // Устанавливаем выбранную категорию, если она указана в маршруте
        const categoryId = this.$route.query.category;
        if (categoryId) {
          const category = this.categories.find((cat) => cat.id == categoryId);
          this.selectedCategory = category ? category.name : "";
        }

        this.loading = false;
      } catch (error) {
        console.error("Ошибка при загрузке товаров или категорий:", error);
        this.loading = false;
      }
    },
    showProductDetails(product) {
      this.selectedProduct = product;
      this.selectedImageIndex = 0;
      this.desiredQuantity = 1;
    },
    closeModal() {
      this.selectedProduct = null;
      this.selectedImageIndex = 0;
    },
    prevImage() {
      const total = this.selectedProduct.images.length;
      this.selectedImageIndex = (this.selectedImageIndex + total - 1) % total;
    },
    nextImage() {
      const total = this.selectedProduct.images.length;
      this.selectedImageIndex = (this.selectedImageIndex + 1) % total;
    },
    addToCart() {
      if (this.desiredQuantity > 0) {
        cartStore.addToCart(this.selectedProduct, this.desiredQuantity);
        alert(`Товар "${this.selectedProduct.name}" добавлен в корзину`);
      }
    },
  },
  created() {
    this.fetchProducts();
  },
  watch: {
    // Следим за изменениями маршрута (если пользователь вернётся назад или вперёд)
    "$route.query.category"(newCategoryId) {
      if (this.categories.length > 0) {
        const category = this.categories.find((cat) => cat.id == newCategoryId);
        this.selectedCategory = category ? category.name : "";
      }
    },
    // Следим за обновлением categories и обновляем selectedCategory
    categories: {
      immediate: true,
      handler(newCategories) {
        const categoryId = this.$route.query.category;
        if (categoryId) {
          const category = newCategories.find((cat) => cat.id == categoryId);
          this.selectedCategory = category ? category.name : "";
        }
      },
    },
  },
};
</script>
<style scoped>
/* Базовые стили для всей страницы */
.product-page {
  min-height: 100vh;
  background-color: #f5f5f7; /* Светлый фон */
  color: #333; /* Темный цвет текста */
  padding: 50px 20px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.product-page h1 {
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 40px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #2c3e50;
}

/* Состояние загрузки */
.loading {
  text-align: center;
  font-size: 1.8rem;
  color: #7f8c8d;
  margin-top: 60px;
}

/* Фильтры */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
}

.search-input,
.category-filter,
.sort-filter {
  min-width: 220px;
  padding: 10px 14px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus,
.category-filter:focus,
.sort-filter:focus {
  border-color: #3498db;
  box-shadow: 0 0 4px #3498db;
}

/* Сетка товаров */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid #ececec;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  font-size: 1.4rem;
  margin: 15px;
  color: #2c3e50;
  text-transform: uppercase;
}

.product-card p {
  font-size: 0.95rem;
  margin: 0 15px 10px;
  line-height: 1.5;
  color: #555;
}

.product-card .price {
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 10px;
}

.product-card .category {
  font-size: 0.9rem;
  font-style: italic;
  color: #3498db;
  margin-bottom: 15px;
}

/* Модальное окно */
.product-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Анимация для содержимого модального окна */
@keyframes fadeInUp {
  from {
    transform: translateY(60px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.product-modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 700px;
  border-radius: 10px;
  padding: 30px;
  position: relative;
  animation: fadeInUp 0.4s ease forwards;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #e74c3c;
}

/* Слайдер */
.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.slider-arrow {
  background: #3498db;
  color: #fff;
  border: none;
  font-size: 1.3rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.slider-arrow:hover {
  background-color: #2c3e50;
}

.slider-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 6px;
}

/* Добавление в корзину */
.add-to-cart {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.add-to-cart label {
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-to-cart input {
  width: 60px;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
}

.add-to-cart button {
  padding: 10px 20px;
  font-size: 1rem;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart button:hover {
  background-color: #c0392b;
}
</style>
