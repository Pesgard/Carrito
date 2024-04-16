// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Referencia a la colección de productos en Firestore
const db = getFirestore(app);
const productosCollection = collection(db, 'productos');

// Función para cargar los productos activados desde Firestore y mostrarlos en la página
async function cargarProductosActivados() {
    try {
        // Consulta solo los productos activados
        const querySnapshot = await getDocs(query(productosCollection, where('estado', '==', true)));
        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            const productCard = `
                <a href="/producto/${doc.id}.html" class="product-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" />
                    <div class="product-info">
                        <div class="product-name">${producto.nombre}</div>
                        <div class="product-price">${producto.precio} MXN</div>
                    </div>
                </a>
            `;
            document.getElementById("productSection").innerHTML += productCard;
        });
    } catch (error) {
        console.error("Error al cargar los productos activados:", error);
    }
}

// Llamar a la función para cargar los productos activados al cargar la página
cargarProductosActivados();
