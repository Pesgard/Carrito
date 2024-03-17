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
