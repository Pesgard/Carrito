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

//Constantes dentro del html
const productPrice = parseFloat(document.getElementById('productPrice').innerText.replace('$', ''));
const count = parseInt(document.getElementById('productCount').value);
const productImage = document.querySelector('.product__images--image img').getAttribute('src');
// Obtener detalles del producto
const productName = document.getElementById('productName').innerText;

let mainImage


// Función para agregar un producto al carrito
document.getElementById("addToCartForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
        cartItems[existingItemIndex].quantity += parseInt(document.getElementById('productCount').value); // Obtener el valor actualizado de la cantidad
      } else {
        // Si el producto no está en el carrito, agregarlo
        cartItems.push({
          name: productName,
          price: productPrice,
          quantity: parseInt(document.getElementById('productCount').value), // Obtener el valor actualizado de la cantidad
          image: mainImage.src
        });
      }

      // Disminuir el stock del producto en la base de datos
      const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
      const productQuerySnapshot = await getDocs(productQuery);
      if (!productQuerySnapshot.empty) {
        const productDoc = productQuerySnapshot.docs[0];
        const productId = productDoc.id;
        const productData = productDoc.data();

        const newStock = productData.cantidad - parseInt(document.getElementById('productCount').value); // Obtener el valor actualizado de la cantidad
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
    updateProductImage(productName)
  } catch (error) {
    console.error(error.message);
  }
});

// Función para actualizar la imagen en el HTML
async function updateProductImage(productName) {
  try {
    const productImage = await getProductImage(productName); // Obtener el enlace de descarga de la imagen
    if (productImage) {
      mainImage = document.querySelector('.product__images__main'); // Seleccionar el elemento de la imagen principal
      mainImage.src = productImage; // Actualizar el atributo src con el enlace de descarga de la imagen
    }
  } catch (error) {
    console.error('Error al actualizar la imagen del producto en el HTML:', error.message);
  }
}

// Función para obtener el enlace de descarga de la imagen de un producto
async function getProductImage(productName) {
  try {
    const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
    const productQuerySnapshot = await getDocs(productQuery);

    if (!productQuerySnapshot.empty) {
      const productDoc = productQuerySnapshot.docs[0];
      const productData = productDoc.data();
      return productData.imagen; // Suponiendo que el campo de la imagen se llama 'img' en la base de datos
    } else {
      console.log('No se encontró el producto en la base de datos');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la imagen del producto:', error.message);
    return null;
  }
}

