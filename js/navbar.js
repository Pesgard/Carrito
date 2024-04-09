// navbar.js
window.addEventListener('DOMContentLoaded', function() {
    const navbarContainer = document.getElementById('navbar-container');

    // Cargar el contenido del navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(html => {
            navbarContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar el navbar:', error);
        });
});
