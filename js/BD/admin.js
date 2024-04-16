// Importa las funciones necesarias desde los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, collection, query, getDocs, setDoc, doc, where, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js'; // Agregar getDownloadURL

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvyv29HOhO1u_VJ11UTgidUghAq7n_vJU",
    authDomain: "e-commerce-53447.firebaseapp.com",
    projectId: "e-commerce-53447",
    storageBucket: "e-commerce-53447.appspot.com",
    messagingSenderId: "93754261648",
    appId: "1:93754261648:web:70966240f346735e5ed815"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Obtener referencias a los elementos del formulario
const form = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const productQuantityInput = document.getElementById('productQuantity');
const productPriceInput = document.getElementById('productPrice');
const productImageInput = document.getElementById('productImage');

const editProductNameInput = document.getElementById("editProductName")
const editProductQuantityInput = document.getElementById("editProductQuantity")
const editProductPriceInput = document.getElementById("editProductPrice")



// Agregar un evento de escucha al formulario para manejar el envío
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario
    const productName = productNameInput.value;
    const productQuantity = parseInt(productQuantityInput.value);
    const productPrice = parseFloat(productPriceInput.value);
    const imageFile = productImageInput.files[0]; // Obtiene el archivo de imagen seleccionado

    // Verificar si se ha seleccionado una imagen
    if (!imageFile) {
        alert('Por favor, seleccione una imagen.');
        return;
    }

    // Obtener el próximo ID de producto
    const nextProductId = await getNextProductId();

    // Llamar a la función para agregar el producto con la imagen
    addProductWithImage(productName, productQuantity, productPrice, imageFile, nextProductId);
});

// Función para obtener el próximo ID de producto
const getNextProductId = async () => {
    try {
        const productQuery = query(collection(firestore, 'productos'));
        const productSnapshot = await getDocs(productQuery);
        const lastProductIndex = productSnapshot.docs.length - 1;
        const lastProduct = productSnapshot.docs[lastProductIndex];
        console.log(lastProduct.id)
        if (lastProduct) {
            const lastProductId = parseInt(lastProduct.id.replace('producto', ''));
            return `producto${lastProductId + 1}`;
        } else {
            return 'producto1'; // Si no hay productos, el próximo ID será producto1
        }
    } catch (error) {
        console.error('Error al obtener el próximo ID de producto:', error);
        return "producto1";
    }
}

// Función para agregar un producto con una imagen a Firebase Storage
const addProductWithImage = async (nombreProducto, cantidadProducto, precioProducto, imageFile, productId) => {
    try {
        // Subir la imagen a Firebase Storage
        const imageName = `${productId}_${imageFile.name}`;
        const storageRef = ref(storage, 'product_images/' + imageName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile); // Cambiar put por uploadBytesResumable

        // Observar el estado de la carga para obtener la URL de descarga después de completarla
        uploadTask.on('state_changed',
            (snapshot) => {
                // Manejar el estado de la carga
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Carga en progreso: ' + progress + '%');
            },
            (error) => {
                // Manejar errores de carga
                console.error('Error al subir la imagen:', error);
            },
            async () => {
                // La carga se completó con éxito, obtén la URL de descarga
                try {
                    const imageURL = await getDownloadURL(storageRef);
                    // Ahora puedes usar imageURL para agregar la URL de descarga del archivo a tu base de datos
                    const productDetails = {
                        estado: true,
                        nombre: nombreProducto,
                        cantidad: cantidadProducto,
                        precio: precioProducto,
                        imagen: imageURL
                        // Agrega más detalles del producto según sea necesario
                    };
                    // Luego, agrega el producto a la base de datos usando la función addProduct
                    await addProduct(productDetails, productId);
                } catch (error) {
                    console.error('Error al obtener la URL de descarga:', error);
                }
            }
        );
    } catch (error) {
        console.error('Error al subir la imagen y agregar el producto:', error);
    }
}

// Función para agregar un producto a la base de datos
const addProduct = async (productDetails, productId) => {
    try {
        // Agrega el producto a la colección "productos" en Firestore con el ID específico
        await setDoc(doc(firestore, 'productos', productId), productDetails);
        alert('Producto agregado correctamente:', productDetails);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
}



// Función para buscar productos por nombre
const searchProductByName = async (productName) => {
    try {
        // Buscar el producto por nombre
        const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
        const productSnapshot = await getDocs(productQuery);

        if (!productSnapshot.empty) {
            console.log('Productos encontrados:');
            productSnapshot.forEach(doc => {
                console.log(doc.data());
            });
        } else {
            console.log('No se encontraron productos con el nombre proporcionado:', productName);
        }
    } catch (error) {
        console.error('Error al buscar productos por nombre:', error.message);
    }
}

// Función para mostrar la lista de productos
const displayProducts = async () => {
    try {
        // Obtener el término de búsqueda del cuadro de búsqueda
        const searchTerm = searchBox.value.trim().toLowerCase();

        // Consultar la colección de productos
        const productsRef = collection(firestore, 'productos');
        const q = query(productsRef); // Solo productos activos

        // Obtener los documentos de productos que coinciden con la búsqueda
        const querySnapshot = await getDocs(q);

        // Limpiar la lista de productos antes de agregar nuevos elementos
        productList.innerHTML = '';

        // Iterar sobre los documentos de productos y agregarlos a la lista
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const idData = doc.id
            const productName = data.nombre.toLowerCase();

            // Verificar si el nombre del producto contiene el término de búsqueda
            if (productName.includes(searchTerm)) {
                // Crear un elemento de lista para el producto
                const li = document.createElement('li');
                li.textContent = `${data.nombre} - Cantidad: ${data.cantidad}, Precio: $${data.precio}, Estado: ${data.estado} `;

                // Crear un botón para desactivar/activar el producto
                const disableButton = document.createElement('button');

                // Verificar el estado del producto y establecer el texto del botón en consecuencia
                if (data.estado) {
                    disableButton.textContent = 'Desactivar';
                } else {
                    disableButton.textContent = 'Activar';
                }

                // Agregar un manejador de eventos al botón de desactivar/activar
                disableButton.addEventListener('click', () => {
                    // Cambiar el estado del producto al hacer clic en el botón
                    if (data.estado) {
                        disableProduct(data.nombre);
                    } else {
                        enableProduct(data.nombre);
                    }
                });

                // Agregar el botón de desactivar/activar al elemento de lista
                li.appendChild(disableButton);

                // Crear un botón para modificar el producto
                const editButton = document.createElement('button');
                editButton.textContent = 'Modificar';

                // Agregar un manejador de eventos al botón de modificar
                editButton.addEventListener('click', () => {
                    // Llamar a la función para manejar la edición del producto
                    handleEditProduct(data, idData);
                });

                // Agregar el botón de modificar al elemento de lista
                li.appendChild(editButton);

                // Agregar el elemento de lista al contenedor de la lista de productos
                productList.appendChild(li);
            }
        });
    } catch (error) {
        console.error('Error al mostrar la lista de productos:', error);
    }
};


// Función para desactivar un producto
const disableProduct = async (productName) => {
    try {
        // Buscar el producto por nombre
        const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
        const productSnapshot = await getDocs(productQuery);

        if (!productSnapshot.empty) {
            const productDoc = productSnapshot.docs[0];
            const productId = productDoc.id;

            // Desactivar el producto (cambiar el estado a false)
            await updateDoc(doc(firestore, 'productos', productId), { estado: false });
            alert('Producto desactivado correctamente:', productName);

            // Actualizar el texto del botón
            updateButtonText(productName, false);
        } else {
            console.log('No se encontró el producto en la base de datos:', productName);
        }
    } catch (error) {
        alert('Error al dar de baja el producto:', error.message);
    }
}

// Función para activar un producto
const enableProduct = async (productName) => {
    try {
        // Buscar el producto por nombre
        const productQuery = query(collection(firestore, 'productos'), where('nombre', '==', productName));
        const productSnapshot = await getDocs(productQuery);

        if (!productSnapshot.empty) {
            const productDoc = productSnapshot.docs[0];
            const productId = productDoc.id;

            // Activar el producto (cambiar el estado a true)
            await updateDoc(doc(firestore, 'productos', productId), { estado: true });
            alert('Producto activado correctamente:', productName);

            // Actualizar el texto del botón
            updateButtonText(productName, true);
        } else {
            console.log('No se encontró el producto en la base de datos:', productName);
        }
    } catch (error) {
        alert('Error al activar el producto:', error.message);
    }
}

// Función para manejar la edición del producto
const handleEditProduct = (productData, idData) => {
    // Llenar el formulario de edición con los detalles del producto seleccionado
    editProductNameInput.value = productData.nombre;
    editProductQuantityInput.value = productData.cantidad;
    editProductPriceInput.value = productData.precio;

    // Mostrar el formulario de edición
    editProductForm.style.display = 'block';
    // Ocultar el formulario de agregar producto (si está visible)
    addProductForm.style.display = 'none';

    // Guardar el ID del producto seleccionado en un atributo de datos del formulario
    editProductForm.setAttribute('data-product-id', idData);
    console.log(idData)
};

// Función para actualizar el texto del botón
const updateButtonText = (productName, newState) => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.dataset.product === productName) {
            button.textContent = newState ? 'Desactivar' : 'Activar';
        }
    });
}

// Agregar un evento de escucha al botón para activar el modo de edición
editModeButton.addEventListener('click', async () => {
    // Obtener el ID del producto seleccionado en el elemento de selección
    const selectedProductId = productSelect.value;

    // Verificar si se ha seleccionado un producto
    if (selectedProductId) {
        // Obtener los detalles del producto seleccionado
        const productRef = doc(firestore, 'productos', selectedProductId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
            const productData = productSnapshot.data();

            // Llenar el formulario de edición con los detalles del producto seleccionado
            editProductNameInput.value = productData.nombre;
            editProductQuantityInput.value = productData.cantidad;
            editProductPriceInput.value = productData.precio;

            // Mostrar el formulario de edición y ocultar el botón "Editar Producto"
            editProductForm.style.display = 'block';
            editModeButton.style.display = 'none';

            // Guardar el ID del producto seleccionado en un atributo de datos del formulario
            editProductForm.setAttribute('data-product-id', selectedProductId);
        } else {
            console.error('No se encontró el producto seleccionado en la base de datos.');
        }
    } else {
        alert('Por favor, seleccione un producto para editar.');
    }
});

// Agregar un evento de escucha al formulario de edición para manejar la actualización de productos
editProductForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario de edición
    const productName = editProductNameInput.value;
    const productQuantity = parseInt(editProductQuantityInput.value);
    const productPrice = parseFloat(editProductPriceInput.value);
    const productId = editProductForm.getAttribute('data-product-id'); // Obtener el ID del producto del atributo de datos

    if (productId) {
        // Llamar a la función para actualizar el producto en Firestore
        await updateProduct(productId, productName, productQuantity, productPrice);
    } else {
        console.error('No se proporcionó el ID del producto.');
    }
});

// Función para actualizar un producto en la base de datos
const updateProduct = async (productId, productName, productQuantity, productPrice) => {
    try {
        // Actualizar los detalles del producto en Firestore
        console.log(productId)
        await updateDoc(doc(firestore, 'productos', productId), {
            nombre: productName,
            cantidad: productQuantity,
            precio: productPrice
        });
        console.log('Producto actualizado correctamente.');

        // Ocultar el formulario de edición después de la actualización
        editProductForm.style.display = 'none';
        // Mostrar nuevamente el formulario de agregar producto
        addProductForm.style.display = 'block';

        // Limpiar los campos del formulario de edición
        editProductNameInput.value = '';
        editProductQuantityInput.value = '';
        editProductPriceInput.value = '';

        // Actualizar la lista de productos
        displayProducts();
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
}


// Agregar un evento de escucha al cuadro de búsqueda para actualizar la lista de productos
searchBox.addEventListener('input', displayProducts);

// Mostrar la lista de productos al cargar la página
window.addEventListener('load', displayProducts);