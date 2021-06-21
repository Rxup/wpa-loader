

// Registering Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/wpa-loader/sw.js')
    .then((reg) => {
        // регистрация сработала
        console.log('Registration succeeded. Scope is ' + reg.scope);
      }).catch((error) => {
        // регистрация прошла неудачно
        console.log('Registration failed with ' + error);
      });
}