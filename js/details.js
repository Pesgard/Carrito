import { getAuth } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_ID_DE_PROYECTO",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "TU_ID_DE_MENSAJERÍA",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

let cartItems = [];

// Función para mostrar el carrito
function toggleCart() {
  const cartBasket = document.getElementById('cartBasket');
  cartBasket.classList.toggle('hidden');
}

// Función para mostrar y ocultar el menú de usuario
function toggleUserMenu() {
  const userMenu = document.getElementById('userMenu');
  userMenu.classList.toggle('hidden');
}

// Función para cerrar sesión
function logout() {
  window.location.href = "/inicio.html";
}

// Función para agregar un producto al carrito
async function addToCart(event) {
  event.preventDefault();

  // Obtener detalles del producto
  const productName = document.getElementById('productName').innerText;
  const productPrice = parseFloat(document.getElementById('productPrice').innerText.replace('$', ''));
  const count = parseInt(document.getElementById('productCount').value);
  const productImage = document.querySelector('.product__images--image img').getAttribute('src');

  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const firestore = getFirestore();
      const cartRef = doc(firestore, 'carts', userId);
      const cartSnapshot = await getDoc(cartRef);
      if (cartSnapshot.exists()) {
        cartItems = cartSnapshot.data().items || [];
      }

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cartItems.findIndex(item => item.name === productName);
      if (existingItemIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        cartItems[existingItemIndex].quantity += count;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cartItems.push({
          name: productName,
          price: productPrice,
          quantity: count,
          image: productImage
        });
      }

      // Guardar el carrito en Firestore
      await setDoc(cartRef, { items: cartItems });

      // Actualizar el carrito en la interfaz de usuario
      updateCart();
    } else {
      console.log('No hay usuario autenticado');
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error.message);
  }
}

// Función para actualizar el carrito en la interfaz de usuario
function updateCart() {
  const cartDetails = document.getElementById('cartDetails');
  cartDetails.innerHTML = '';
  let totalAmount = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    cartDetails.innerHTML += `
            <div>
                <img src="${item.image}" alt="${item.name}" style="width: 50px;">
                <p>${item.name} - $${item.price.toFixed(2)} MXN x ${item.quantity}</p>
                <button onclick="removeItem('${item.name}')">Remove</button>
            </div>
        `;
  });

  const totalAmountElement = document.getElementById('totalAmount');
  totalAmountElement.innerText = `Total: $${totalAmount.toFixed(2)} MXN`;
}

// Función para eliminar un producto del carrito
function removeItem(name) {
  cartItems = cartItems.filter(item => item.name !== name);
  updateCart();
}

// Función para incrementar la cantidad de productos
const plusCountInput = document.getElementById('plusProductCount').addEventListener("click", async (e) => {
  const countInput = document.getElementById('productCount')
  countInput.value = parseInt(countInput.value) + 1;
  console.log(countInput.value)
});


// Función para decrementar la cantidad de productos
const minusCountInput = document.getElementById('minusProductCount').addEventListener("click", async (e) => {
  const countInput = document.getElementById('productCount');
  const newValue = parseInt(countInput.value) - 1;
  countInput.value = newValue < 1 ? 1 : newValue;
  console.log(countInput.value)
})


// Evento para cargar el carrito desde Firestore al cargar la página
window.addEventListener('load', async function () {
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const cartRef = doc(firestore, 'carts', userId);
      const cartSnapshot = await getDoc(cartRef);
      if (cartSnapshot.exists()) {
        cartItems = cartSnapshot.data().items || [];
        updateCart();
      }
    }
  } catch (error) {
    console.error('Error al cargar el carrito desde Firestore:', error.message);
  }
});
