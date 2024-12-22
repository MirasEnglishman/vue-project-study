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
.admin-page {
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.data-table th {
    background-color: #007bff;
    color: #fff;
}

.add-button,
.edit-button,
.delete-button,
.save-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add-button:hover,
.edit-button:hover,
.delete-button:hover,
.save-button:hover {
    background-color: #0056b3;
}

.delete-button {
    background-color: #dc3545;
}

.delete-button:hover {
    background-color: #a71d2a;
}

.category-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.category-list li {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 5px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
}
</style>
