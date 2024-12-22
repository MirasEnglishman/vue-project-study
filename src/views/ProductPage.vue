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
/* Общий стиль страницы */
.product-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30px 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.product-page h1 {
  margin-bottom: 30px;
  color: #333;
}

.loading {
  font-size: 1.5em;
  color: #888;
}

/* Фильтры */
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
}

.search-input,
.category-filter,
.sort-filter {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus,
.category-filter:focus,
.sort-filter:focus {
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.3);
}

/* Список товаров */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  justify-items: center;
}

.product-card {
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.product-card h3 {
  font-size: 1.2em;
  margin: 10px 0;
  color: #333;
}

.product-card p {
  margin: 5px 0;
  color: #555;
}

.product-card .price {
  font-weight: bold;
  color: #007bff;
}

.product-card .category {
  font-size: 0.9em;
  color: #777;
  font-style: italic;
}

/* Модальное окно */
.product-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.product-modal-content {
  background-color: #fff;
  position: relative;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  animation: showModal 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  font-weight: bold;
  color: #aaa;
  cursor: pointer;
}

.close-btn:hover {
  color: #333;
}

.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.slider-arrow {
  cursor: pointer;
  background-color: #eee;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 10px;
  transition: background-color 0.2s;
  user-select: none;
}

.slider-arrow:hover {
  background-color: #ddd;
}

.slider-image {
  max-width: 80%;
  max-height: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
  object-fit: cover;
}

.add-to-cart {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.add-to-cart input {
  width: 60px;
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.add-to-cart button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
