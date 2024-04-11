document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const displayMessage = document.getElementById("displayMessage");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        displayMessage.innerHTML = `
            <p><strong>Nombre:</strong> ${formDataObject.name}</p>
            <p><strong>Correo electrónico:</strong> ${formDataObject.email}</p>
            <p><strong>Mensaje:</strong> ${formDataObject.message}</p>
        `;
    });
});