import { getAuth } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvyv29HOhO1u_VJ11UTgidUghAq7n_vJU",
  authDomain: "e-commerce-53447.firebaseapp.com",
  projectId: "e-commerce-53447",
  storageBucket: "e-commerce-53447.appspot.com",
  messagingSenderId: "93754261648",
  appId: "1:93754261648:web:70966240f346735e5ed815"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);



// Función para cerrar sesión
function logout() {
  window.location.href = "/inicio.html";
}

/// Función para agregar un producto al carrito
document.getElementById("addToCartForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener detalles del producto
  let productName = document.getElementById('productName').innerText;
  // Eliminar la cadena "Candleaf®" del nombre del producto
  productName = productName.replace(/ Candleaf®/g, '');

  const productPrice = parseFloat(document.getElementById('productPrice').innerText.replace('$', ''));
  const count = parseInt(document.getElementById('productCount').value);
  const productImage = document.querySelector('.product__images--image img').getAttribute('src');

  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const cartRef = doc(firestore, 'carts', userId);
      const cartSnapshot = await getDoc(cartRef);
      let cartItems = [];

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

      // Disminuir el stock del producto en la base de datos
      const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
      const productQuerySnapshot = await getDocs(productQuery);
      if (!productQuerySnapshot.empty) {
        const productDoc = productQuerySnapshot.docs[0];
        const productId = productDoc.id;
        const productData = productDoc.data();

        const newStock = productData.cantidad - count;
        if (newStock >= 0) {
          // Actualizar el stock solo si hay suficiente cantidad disponible
          await updateDoc(doc(firestore, 'productos', productId), { cantidad: newStock });

          // Guardar el carrito en Firestore después de actualizar el stock
          await setDoc(cartRef, { items: cartItems });
        } else {
          console.log('No hay suficiente stock disponible');
          alert("No hay suficiente stock Disponible")
          return;
        }
      } else {
        console.log('No se encontró el producto en la base de datos');
        return;
      }
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error.message);
  }
});

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
});

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
