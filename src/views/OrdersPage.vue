<template>
    <div class="orders-page">
      <h1>Orders List</h1>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
     
              <th>Client Name</th>
              <th>Client Address</th>
              <th>Client Phone</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>
               
                {{ order.product.name }}
              </td>
              <td>{{ order.product.content }}</td>
              <td>${{ order.product.price }}</td>
            
              <td>{{ order.client.first_name }} {{ order.client.last_name }}</td>
              <td>{{ order.client.address }}</td>
              <td>{{ order.client.phone_number }}</td>
              <td>{{ formatDate(order.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { format } from 'date-fns';
  
  export default {
    name: 'OrdersPage',
    data() {
      return {
        orders: [],
        loading: true,
      };
    },
    methods: {
      fetchOrders() {
        axios
          .get('http://127.0.0.1:8000/api/orders')
          .then((response) => {
            this.orders = response.data;
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error fetching orders:', error);
            this.loading = false;
          });
      },
      formatDate(date) {
        return format(new Date(date), 'dd.MM.yyyy');
      },
    },
    created() {
      this.fetchOrders();
    },
  };
  </script>
  
  <style scoped>
  .orders-page {
    text-align: center;
    padding: 20px;
  }
  
  .orders-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  .orders-table th, .orders-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .orders-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .orders-table img {
    width: 50px;
    height: auto;
    border-radius: 4px;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  .orders-table td {
    font-size: 0.9em;
  }
  
  .orders-table .price {
    font-weight: bold;
    color: #E4530F;
  }
  
  .orders-table .stock, .orders-table .order-date {
    color: #555;
  }
  </style>
  