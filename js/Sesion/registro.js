import { createUser } from "../BD/firebase.js";

const formularioRegistro = document.getElementById("registrationForm");

formularioRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");

    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    createUser(email, password, firstName, lastName);
});