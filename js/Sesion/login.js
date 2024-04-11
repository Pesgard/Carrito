import { loginUser } from "../BD/firebase.js";

//INICIO DE SESION DE USUARIOS
const formularioLogin = document.getElementById("loginForm");
formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    loginUser(email, password);
});
