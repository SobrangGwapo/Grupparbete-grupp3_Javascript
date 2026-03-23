// Loggin script
const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '123456') {
        alert('Inloggning lyckades!');
        location.href = 'index.html';
     } else {
        alert('Felaktigt användarnamn eller lösenord. Försök igen.');
    }
});

// Toggle lösenord
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});