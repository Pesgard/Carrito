
 // Función para cargar la configuración guardada en las cookies al cargar la página
 window.addEventListener('load', function() {
    loadConfiguration();
});


// Función para aplicar el primer tema predefinido
function setTheme1() {
    document.getElementById('backgroundColor').value = '#f1f4fe'; // Color de fondo
    document.getElementById('fontColor').value = '#424242'; // Color de letra
    document.getElementById('headerFooterColor').value = '#f1f4fe'; // Color de fondo del header y footer
}

// Función para aplicar el segundo tema predefinido
function setTheme2() {
    document.getElementById('backgroundColor').value = '#ffe6e6'; // Color de fondo
    document.getElementById('fontColor').value = '#333'; // Color de letra
    document.getElementById('headerFooterColor').value = '#ffe6e6'; // Color de fondo del header y footer
}

// Función para aplicar el tercer tema predefinido
function setTheme3() {
    document.getElementById('backgroundColor').value = '#f0f0f0'; // Color de fondo
    document.getElementById('fontColor').value = '#555'; // Color de letra
    document.getElementById('headerFooterColor').value = '#f0f0f0'; // Color de fondo del header y footer
}


// Función para cargar la configuración guardada en las cookies al cargar la página
function loadConfiguration() {
    const cookies = document.cookie.split(';'); // Obtener todas las cookies
    let siteConfigurationCookie = null;

    // Buscar la cookie de configuración
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('siteConfiguration=')) {
            siteConfigurationCookie = cookie.substring('siteConfiguration='.length, cookie.length);
            break;
        }
    }

    // Si se encontró la cookie de configuración
    if (siteConfigurationCookie) {
        // Parsear la configuración guardada en la cookie
        const configuration = JSON.parse(siteConfigurationCookie);

        // Aplicar los estilos guardados en la configuración
        applyStyles(configuration);

        // Aplicar los valores guardados en la configuración a los elementos de la interfaz
        document.getElementById('fontSize').value = configuration.fontSize;
        document.getElementById('backgroundColor').value = configuration.backgroundColor;
        document.getElementById('fontColor').value = configuration.fontColor;
        document.getElementById('headerFooterColor').value = configuration.headerFooterColor;
    }
}


// Función para guardar la configuración en una cookie y aplicarla a los estilos
function saveConfiguration() {
    // Obtener los valores seleccionados por el usuario
    const fontSize = document.getElementById('fontSize').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const fontColor = document.getElementById('fontColor').value;
    const headerFooterColor = document.getElementById('headerFooterColor').value;

    // Crear un objeto con la configuración
    const configuration = {
        fontSize: fontSize,
        backgroundColor: backgroundColor,
        fontColor: fontColor,
        headerFooterColor: headerFooterColor
    };

    // Convertir el objeto de configuración a una cadena JSON
    const configurationJSON = JSON.stringify(configuration);

    // Guardar la configuración en una cookie con nombre "siteConfiguration"
    document.cookie = `siteConfiguration=${configurationJSON}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;

    // Aplicar los cambios de configuración a los estilos
    applyStyles(configuration);
}

// Función para restaurar la configuración por defecto
function setDefaultConfiguration() {
    // Borrar la cookie de configuración
    document.cookie = 'siteConfiguration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Reiniciar los valores por defecto en la interfaz
    document.getElementById('fontSize').value = 'medium';
    document.getElementById('backgroundColor').value = '#f1f4fe';
    document.getElementById('fontColor').value = '#424242';
    document.getElementById('headerFooterColor').value = '#f1f4fe';

    // Aplicar los estilos por defecto
    applyDefaultStyles();
}

// Función para aplicar los estilos guardados en la configuración
function applyStyles(configuration) {
    // Estilos.css
    document.documentElement.style.setProperty('--font-size', configuration.fontSize);
    document.documentElement.style.setProperty('--background-color', configuration.backgroundColor);
    document.documentElement.style.setProperty('--font-color', configuration.fontColor);
    document.documentElement.style.setProperty('--header-footer-color', configuration.headerFooterColor);

    // Estilos de section-styles.css
    const sectionStyles = document.createElement('link');
    sectionStyles.rel = 'stylesheet';
    sectionStyles.type = 'text/css';
    sectionStyles.href = 'css/seccion-style.css';
    document.head.appendChild(sectionStyles);

    // Estilos de products.css
    const productsStyles = document.createElement('link');
    productsStyles.rel = 'stylesheet';
    productsStyles.type = 'text/css';
    productsStyles.href = 'css/products.css';
    document.head.appendChild(productsStyles);

    // Estilos de contacto.css
    const contactoStyles = document.createElement('link');
    contactoStyles.rel = 'stylesheet';
    contactoStyles.type = 'text/css';
    contactoStyles.href = 'css/contacto.css';
    document.head.appendChild(contactoStyles);
}

// Función para aplicar los estilos por defecto
function applyDefaultStyles() {
    // Estilos.css
    document.documentElement.style.removeProperty('--font-size');
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--font-color');
    document.documentElement.style.removeProperty('--header-footer-color');

    // Remover estilos de section-styles.css
    const sectionStyles = document.querySelector('link[href="css/section-styles.css"]');
    if (sectionStyles) {
        sectionStyles.remove();
    }

    // Remover estilos de products.css
    const productsStyles = document.querySelector('link[href="css/products.css"]');
    if (productsStyles) {
        productsStyles.remove();
    }

    // Remover estilos de contacto.css
    const contactoStyles = document.querySelector('link[href="css/contacto.css"]');
    if (contactoStyles) {
        contactoStyles.remove();
    }
}
