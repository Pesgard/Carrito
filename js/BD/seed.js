// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDvyv29HOhO1u_VJ11UTgidUghAq7n_vJU",
    authDomain: "e-commerce-53447.firebaseapp.com",
    projectId: "e-commerce-53447",
    storageBucket: "e-commerce-53447.appspot.com",
    messagingSenderId: "93754261648",
    appId: "1:93754261648:web:70966240f346735e5ed815"
};

// Inicializa tu aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);

// Array de objetos que representa los productos y sus imágenes de referencia
const productos = [
    { nombre: 'Spiced Mint', precio: 200.50, imagen: '/img/producto.png', cantidad: 7 },
    { nombre: 'Sweet Strawberry', precio: 200.50, imagen: '/img/producto2.png', cantidad: 7 },
    { nombre: 'Cool Blueberries', precio: 200.50, imagen: '/img/producto3.png', cantidad: 7 },
    { nombre: 'Juicy Lemon', precio: 200.50, imagen: '/img/producto4.png', cantidad: 7 },
    { nombre: 'Fragrant Cinnamon', precio: 200.50, imagen: '/img/producto5.png', cantidad: 7 },
    { nombre: 'Summer Cherries', precio: 200.50, imagen: '/img/producto6.png', cantidad: 7 }
];

// Función para agregar productos a la colección de productos en Firestore
const agregarProductos = async () => {
    try {
        // Itera sobre el array de productos y guárdalos en la colección de productos en Firestore
        for (let i = 0; i < productos.length; i++) {
            const productoData = productos[i];
            const productoID = `producto${i + 1}`; // Genera el ID del producto
            await setDoc(doc(firestore, 'productos', productoID), productoData);
            console.log('Producto insertado exitosamente:', productoData);
        }
    } catch (error) {
        console.error('Error al insertar productos:', error.message);
    }
};

// Escucha el clic en el botón y llama a la función agregarProductos
document.getElementById('runScriptButton').addEventListener('click', agregarProductos);
