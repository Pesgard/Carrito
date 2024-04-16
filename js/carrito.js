// Importar las funciones necesarias de Firestore
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

let cartItems = [];

// Función para limpiar el carrito del usuario
async function clearCart() {
    try {
        // Limpiar el array de elementos del carrito
        cartItems = [];

        // Actualizar el carrito en Firestore
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const cartRef = doc(firestore, 'carts', userId);

            // Actualizar el carrito en Firestore con el array vacío
            await setDoc(cartRef, { items: cartItems });

            // Mostrar una alerta de que la compra se realizó con éxito
            alert('¡Tu carrito se ha limpiado con éxito!');

            // Redirigir al usuario a la página de productos
            window.location.href = "/productos.html";

            // Actualizar el carrito en la interfaz de usuario
            updateCart();
        }
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
    }
}


// Función para mostrar el carrito
function toggleCart() {
    const cartBasket = document.getElementById('cartBasket');
    cartBasket.classList.toggle('hidden');

    // Mostrar el contenido del carrito al abrirlo
    if (!cartBasket.classList.contains('hidden')) {
        displayCartItems();
    }
}

// Función para mostrar el contenido del carrito
async function displayCartItems() {
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
}

// Función para actualizar el carrito en la interfaz de usuario
const cartButton = document.getElementById("toggleCartButton");
cartButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart();
});

// Abrir el LogOut Button
const userButton = document.getElementById("userButton");
userButton.addEventListener("click", (e) => {
    const userMenu = document.getElementById("userMenu");
    e.preventDefault();
    userMenu.classList.toggle('hidden');
});

// Función para cerrar la sesión actual y redirigir al usuario a /inicio.html
const logOutButton = document.getElementById("logOutButton");
logOutButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        auth.signOut()
        window.location.href = "/inicio.html";
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
})

//Funcion para agregar los pagos de los productos:
const checkoutButton = document.getElementById("checkoutButton")
checkoutButton.addEventListener("click", () => {
    clearCart()
})


//Funcion para eliminar el contenido del carrito de compras y devolverlo a la base de datos
const deleteItemButton = document.getElementById("removeButton");
deleteItemButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeProductCart();
});

// Función para cargar el carrito desde Firestore al cargar la página
window.addEventListener('load', async function () {
    displayCartItems();
});

// Función para actualizar el carrito en la interfaz de usuario
function updateCart() {
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        cartDetails.innerHTML += `
            <div>
                <img src="${item.image}" alt="${item.name}" style="width: 50px;">
                <p>${item.name} - $${item.price.toFixed(2)} MXN x ${item.quantity}</p>
                <button class="removeButton" data-index="${index}">Eliminar ${item.name}</button>
            </div>
        `;
    });

    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.innerText = `Total: $${totalAmount.toFixed(2)} MXN`;

    // Agregar event listener para los botones de eliminar
    const removeButtons = document.querySelectorAll('.removeButton');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

// Función para eliminar un producto del carrito y restaurar su cantidad en la base de datos
async function removeItemFromCart(event) {
    const index = event.target.dataset.index;
    const removedItem = cartItems[index];

    // Eliminar el producto del carrito
    cartItems.splice(index, 1);

    try {
        // Actualizar el carrito en Firestore
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const cartRef = doc(firestore, 'carts', userId);
            await setDoc(cartRef, { items: cartItems });

            // Buscar el producto en la colección "productos" por su nombre
            const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', removedItem.name));
            const productQuerySnapshot = await getDocs(productQuery);

            // Restaurar la cantidad del producto en la base de datos
            if (!productQuerySnapshot.empty) {
                const productDoc = productQuerySnapshot.docs[0];
                const productId = productDoc.id;
                const productData = productDoc.data();

                const newStock = productData.cantidad + removedItem.quantity;
                await updateDoc(doc(firestore, 'productos', productId), {
                    cantidad: newStock
                });
            } else {
                console.log('No se encontró el producto en la base de datos', error);
            }

            // Actualizar el carrito en la interfaz de usuario
            updateCart();
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}
