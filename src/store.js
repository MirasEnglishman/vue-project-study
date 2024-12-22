import { reactive, watch } from "vue";

// 1) Создаём реактивный объект для корзины
export const cartStore = reactive({
  cart: [],

  // Добавить товар в корзину
  addToCart(product, quantity) {
    const existingItem = this.cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
  },

  // Удалить товар из корзины
  removeFromCart(productId) {
    const index = this.cart.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      this.cart.splice(index, 1); // Используем splice для корректной работы с реактивностью
    }
  },

  // Обновить количество
  updateQuantity(productId, newQuantity) {
    const cartItem = this.cart.find((item) => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity = newQuantity;
      if (cartItem.quantity <= 0) {
        this.removeFromCart(productId);
      }
    }
  },

  // Очистить корзину
  clearCart() {
    this.cart.splice(0); // Полностью очищаем массив, чтобы сохранить реактивность
  },
});

// 2) При инициализации пытаемся загрузить корзину из localStorage
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  try {
    const parsedCart = JSON.parse(savedCart);
    cartStore.cart.splice(0, cartStore.cart.length, ...parsedCart); // Загружаем сохранённые данные в реактивный массив
  } catch (error) {
    console.error("Ошибка при парсинге cart из localStorage:", error);
  }
}

// 3) Следим за изменениями в cart и сохраняем в localStorage
watch(
  () => cartStore.cart,
  (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  { deep: true } // обязательно deep: true, т.к. cart — это массив объектов
);
