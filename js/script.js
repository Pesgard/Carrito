function togglePassword() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.querySelector(".eye-icon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
}

function registerUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtener los valores de los campos del formulario
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Comprobar si el usuario ya está registrado
    const existingUsers = getRegisteredUsers();
    const userExists = existingUsers.find(user => user.email === email);
    if (userExists) {
        alert('El usuario ya está registrado.');
        return;
    }

    // Crear un nuevo objeto de usuario
    const newUser = {
        firstName,
        lastName,
        email,
        password
    };

    // Agregar el nuevo usuario a la lista de usuarios registrados
    existingUsers.push(newUser);

    // Guardar la lista actualizada de usuarios registrados en la cookie
    setRegisteredUsers(existingUsers);

    // Limpiar los campos del formulario
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    // Confirmar el registro exitoso
    alert('Usuario registrado correctamente.');
}

function deleteUserCookie() {
    // Eliminar la cookie de usuarios registrados
    document.cookie = 'registeredUsers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    alert('Cookie de usuarios registrados eliminada.');
}

function listRegisteredUsers() {
    // Obtener la lista de usuarios registrados
    const registeredUsers = getRegisteredUsers();

    // Mostrar la lista de usuarios registrados en el elemento "registeredUsersList"
    const listContainer = document.getElementById('registeredUsersList');
    listContainer.innerHTML = ''; // Limpiar la lista antes de agregar los usuarios

    registeredUsers.forEach(user => {
        const listItem = document.createElement('div');
        listItem.textContent = `Nombre: ${user.firstName} ${user.lastName}, Email: ${user.email}, Contraseña: ${user.password}`;
        listContainer.appendChild(listItem);
    });
}

// Función para obtener la lista de usuarios registrados desde la cookie
function getRegisteredUsers() {
    const cookies = document.cookie.split(';');
    const registeredUsersCookie = cookies.find(cookie => cookie.trim().startsWith('registeredUsers='));
    if (registeredUsersCookie) {
        const usersJson = decodeURIComponent(registeredUsersCookie.split('=')[1]);
        return JSON.parse(usersJson);
    } else {
        return [];
    }
}

// Función para guardar la lista de usuarios registrados en la cookie
function setRegisteredUsers(users) {
    const usersJson = JSON.stringify(users);
    document.cookie = `registeredUsers=${encodeURIComponent(usersJson)}; path=/;`;
}

//INICIO DE SESION DE USUARIOS

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    } else {
        console.error('El formulario de inicio de sesión no se encontró en el DOM.');
    }
});

function loginUser(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores de los campos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Obtener la lista de usuarios registrados desde la cookie
    const registeredUsers = getRegisteredUsers();

    // Verificar si las credenciales coinciden con algún usuario registrado
    const user = registeredUsers.find(user => user.email === email && user.password === password);

    if (user) {
        // Credenciales válidas, redireccionar al usuario a la página de productos
        window.location.href = '/productos.html';
    } else {
        // Credenciales inválidas, mostrar un mensaje de error
        alert('Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.');
    }
}

// Función para obtener la lista de usuarios registrados desde la cookie
function getRegisteredUsers() {
    const cookies = document.cookie.split(';');
    const registeredUsersCookie = cookies.find(cookie => cookie.trim().startsWith('registeredUsers='));
    if (registeredUsersCookie) {
        const usersJson = decodeURIComponent(registeredUsersCookie.split('=')[1]);
        return JSON.parse(usersJson);
    } else {
        return [];
    }
}