<template>
    <div class="admin-page">
        <h1>Admin Page</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <!-- Таблица продуктов -->
            <h2>Products</h2>
            <button class="add-button" @click="openProductForm()">Add Product</button>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td><img :src="product.image" alt="Product image" class="product-image" v-if="product.image" />
                        </td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.category_name }}</td>
                        <td>{{ product.description }}</td>
                        <td>
                            <button class="edit-button" @click="openProductForm(product)">Edit</button>
                            <button class="delete-button" @click="deleteProduct(product.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Список категорий -->
            <h2>Categories</h2>
            <ul class="category-list">
                <li v-for="category in categories" :key="category.id">
                    <strong>{{ category.name }}</strong> (ID: {{ category.id }})
                </li>
            </ul>

            <!-- Таблица заказов -->
            <!-- Таблица заказов -->
<h2>Orders</h2>
<table class="data-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Client</th>
            <th>Date</th>
            <th>Description</th>
            <th>Image</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.product_name }}</td>
            <td>{{ order.client_name }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.product_description }}</td>
            <td>
                <img :src="order.product_image" alt="Product Image" class="product-image" />
            </td>
        </tr>
    </tbody>
</table>

        </div>

        <!-- Модальные окна -->
        <div v-if="showProductForm" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelEdit">&times;</span>
                <h3>{{ formProduct.id ? 'Edit' : 'Add' }} Product</h3>
                <form @submit.prevent="saveProduct">
                    <!-- Поле Name -->
                    <label>
                        Name:
                        <input v-model="formProduct.name" type="text" required />
                    </label>

                    <!-- Поле Description -->
                    <label>
                        Description:
                        <textarea v-model="formProduct.description" rows="4" required></textarea>
                    </label>

                    <!-- Поле Image -->
                    <label>
                        Image URL:
                        <input v-model="formProduct.image" type="text" />
                    </label>

                    <!-- Поле Images (JSON) -->
                    <label>
                        Additional Images (JSON):
                        <textarea v-model="formProduct.images" rows="3" placeholder='["url1", "url2"]'></textarea>
                    </label>

                    <!-- Поле Category -->
                    <label>
                        Category:
                        <select v-model="formProduct.category_id" required>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </label>

                    <!-- Поле Price -->
                    <label>
                        Price:
                        <input v-model="formProduct.price" type="number" step="0.01" required />
                    </label>

                    <button type="submit" class="save-button">Save</button>
                </form>
            </div>
        </div>

    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'AdminPage',
    data() {
        return {
            products: [],
            categories: [],
            orders: [],
            formProduct: {
                id: null,
                name: '',
                description: '',
                image: '',
                images: [],
                category_id: null,
                price: 0,
            },
            showProductForm: false,
            loading: true,
        };
    },
    methods: {
        checkAuth() {
            if (!localStorage.getItem('token')) {
                this.$router.push('/login');
            }
        },
        async fetchProducts() {
            try {
                const response = await axios.get('/api/products', this.getAuthHeader());
                this.products = response.data.map(product => ({
                    ...product,
                    category_name: this.categories.find(cat => cat.id === product.category_id)?.name || 'Unknown',
                }));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('/api/categories', this.getAuthHeader());
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchOrders() {
            try {
                const response = await axios.get('/api/orders', this.getAuthHeader());
                this.orders = response.data.map(order => ({
                    id: order.id,
                    product_name: order.product.name,
                    client_name: order.user.name,
                    date: order.date,
                    product_image: order.product.image,
                    product_description: order.product.description,
                }));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },
        getAuthHeader() {
            return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        },
        openProductForm(product = null) {
            this.showProductForm = true;
            this.formProduct = product || {
                id: null,
                name: '',
                description: '',
                image: '',
                images: [],
                category_id: null,
                price: 0,
            };
        },
        cancelEdit() {
            this.showProductForm = false;
        },
        async saveProduct() {
            try {
                const method = this.formProduct.id ? 'put' : 'post';
                const url = this.formProduct.id ? `/api/products/${this.formProduct.id}` : '/api/products';

                const productData = { ...this.formProduct };
                if (!productData.images || productData.images.length === 0) {
                    delete productData.images;
                }

                await axios[method](url, productData, this.getAuthHeader());
                this.fetchProducts();
                this.showProductForm = false;
            } catch (error) {
                console.error('Error saving product:', error.response?.data || error.message);
            }
        },
        async deleteProduct(id) {
            try {
                await axios.delete(`/api/products/${id}`, this.getAuthHeader());
                this.fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        },
    },
    created() {
        this.checkAuth();
        this.fetchCategories();
        this.fetchProducts();
        this.fetchOrders();
    },
};
</script>

<style scoped>
/* Контейнер админ-панели */
.admin-page {
  min-height: 100vh;            /* Заполняем всю высоту экрана */
  padding: 20px 40px;
  background-color: #f9f9f9;    /* Светлый фон вместо градиентов */
  font-family: "Open Sans", sans-serif;
  color: #333;                  /* Тёмно-серый цвет текста */
  box-sizing: border-box;       /* Гарантия корректных отступов */
}

/* Заголовки */
h1,
h2 {
  margin-bottom: 20px;
  text-align: left;            /* Выравниваем по левому краю */
  font-weight: 700;
  text-transform: none;        /* Убираем uppercase */
  letter-spacing: normal;      /* Сбрасываем растяжение букв */
  color: #444;                 /* Смягчённый тёмно-серый */
  text-shadow: none;           /* Убираем тени */
}

/* Состояние загрузки */
div[v-if="loading"] {
  font-size: 1.1rem;
  color: #666;
  margin: 20px 0;
}

/* Таблица (продукты, заказы) */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #fff;
  border: 1px solid #ddd;      /* Тонкая рамка вокруг */
  border-radius: 6px;
  overflow: hidden;            /* Скругляет углы */
}

.data-table th,
.data-table td {
  padding: 12px 10px;
  text-align: center;
  font-size: 0.95rem;
  color: #333;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #fafafa;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

/* Изображения товаров */
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Кнопки (добавить, редактировать, удалить, сохранить) */
.add-button,
.edit-button,
.delete-button,
.save-button {
  display: inline-block;
  padding: 8px 14px;
  font-size: 0.9rem;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  color: #fff;
  margin: 5px 0;
}

.add-button,
.edit-button {
  background-color: #5bc0de; /* Голубой */
}

.add-button:hover,
.edit-button:hover {
  background-color: #31b0d5; /* Темнее при ховере */
  transform: translateY(-2px);
}

.delete-button {
  background-color: #d9534f; /* Красный */
}

.delete-button:hover {
  background-color: #c9302c;
  transform: translateY(-2px);
}

.save-button {
  background-color: #5cb85c; /* Зелёный */
  border: none;
}

.save-button:hover {
  background-color: #4cae4c;
  transform: translateY(-2px);
}

/* Список категорий */
.category-list {
  list-style: none;
  margin: 20px 0;
  padding: 0;
}

.category-list li {
  padding: 10px;
  margin-bottom: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
}

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Тёмная подложка */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 1.4rem;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s;
}

.close:hover {
  transform: scale(1.2);
}

.modal-content h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #444;
}

/* Поля формы внутри модального окна */
.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-content form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 5px;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  margin-top: 5px;
  padding: 8px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  outline: none;
  transition: border-color 0.3s;
}

.modal-content input:focus,
.modal-content textarea:focus,
.modal-content select:focus {
  border-color: #5bc0de; /* Голубой при фокусе */
}
</style>
