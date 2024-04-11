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

