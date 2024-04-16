// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
import { } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvyv29HOhO1u_VJ11UTgidUghAq7n_vJU",
  authDomain: "e-commerce-53447.firebaseapp.com",
  projectId: "e-commerce-53447",
  storageBucket: "e-commerce-53447.appspot.com",
  messagingSenderId: "93754261648",
  appId: "1:93754261648:web:70966240f346735e5ed815",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app)

// Establece un observador para el estado de la autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Si hay un usuario autenticado, carga su carrito
    await cargarCarritoUsuario(user.uid);
  } else {
    console.log('No hay usuario autenticado');
  }
});

// Función para crear un usuario y su carrito en Firestore
export async function createUser(email, password, firstName, lastName) {
  try {
    // Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guarda la información del usuario en Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    // Crea una colección de carrito para el usuario con el mismo ID
    await setDoc(doc(firestore, 'carts', user.uid), {
      products: [] // Inicialmente el carrito estará vacío, pero puedes almacenar productos aquí
    });
    console.log('Usuario registrado exitosamente:', user);
    window.location.href = '/inicio.html'
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    alert("Error al registrar al usuario", error.message)
  }
}

export const loginUser = async (email, password) => {
  try {

    // Intenta iniciar sesión con el correo y la contraseña proporcionados
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Configura la persistencia de sesión para mantener la sesión hasta que se cierre explícitamente
    await setPersistence(auth, browserLocalPersistence);

    // Verifica si el usuario es un administrador
    const user = userCredential.user;
    const uid = user.uid

    // Redirige al usuario a la página correspondiente
    if (uid === "T9A38Fw5cPXA7RcqtTRI7qFRCv62") {
      // Si es administrador, redirige a admin.html
      window.location.href = '/admin.html';
      console.log("Inicio de sesión Administrador:", user.email);
      alert("Inicio de sesión correcto Administrador");
    } else {
      // Si no es administrador, redirige a productos.html
      window.location.href = '/productos.html';
      // El usuario ha iniciado sesión correctamente
      console.log("Inicio de sesión:", user.email);
      alert("Inicio de sesión correcto");
    }

    // Llama a la función para cargar el carrito del usuario
  } catch (error) {
    // Hubo un error al iniciar sesión
    console.error("Error al iniciar sesión:", error.message);
    alert("Error al iniciar sesión. Por favor, intenta nuevamente.");
  }
}

// Función para cargar el carrito del usuario al iniciar sesión
export const cargarCarritoUsuario = async () => {
  try {
    // Obtiene la instancia de autenticación
    const auth = getAuth();

    // Verifica si hay un usuario autenticado
    const user = auth.currentUser;
    if (user && user.uid) { // Verifica que user no sea undefined y que uid esté definido
      const userId = user.uid;

      // Obtén una referencia a Firestore
      const firestore = getFirestore();

      // Consulta la información del carrito del usuario en Firestore
      const docRef = doc(firestore, 'carts', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cartData = docSnap.data();
        console.log('Carrito del usuario:', cartData);
        // Aquí puedes cargar la información del carrito en la página o realizar otras acciones necesarias
        console.log(userId)
      } else {
        console.log('No se encontró el carrito del usuario');
      }
    } else {
      console.log('No hay usuario autenticado o no se pudo obtener el UID');
    }
  } catch (error) {
    console.error('Error al cargar el carrito del usuario:', error.message);
  }
}

// Función para guardar el carrito en Firestore
export async function saveCartToFirestore() {
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const cartRef = doc(firestore, 'carts', userId);
      await setDoc(cartRef, { items: cartItems });
      console.log('Carrito guardado en Firestore');
    } else {
      console.log('No hay usuario autenticado');
    }
  } catch (error) {
    console.error('Error al guardar el carrito en Firestore:', error.message);
  }
}

// Función para actualizar el carrito desde Firestore
export async function updateCartFromFirestore() {
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const cartRef = doc(firestore, 'carts', userId);
      const cartSnapshot = await getDoc(cartRef);
      if (cartSnapshot.exists()) {
        cartItems = cartSnapshot.data().items;
        console.log('Carrito cargado desde Firestore:', cartItems);
        updateCart();
      } else {
        console.log('No se encontró el carrito del usuario en Firestore');
      }
    } else {
      console.log('No hay usuario autenticado');
    }
  } catch (error) {
    console.error('Error al cargar el carrito desde Firestore:', error.message);
  }
}