import { cargarCarritoUsuario } from "./BD/firebase.js";

// Ejecuta la función cargarCarritoUsuario al cargar la ventana
window.addEventListener('DOMContentLoaded', () => {
    cargarCarritoUsuario();
});