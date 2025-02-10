document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'index.html';
  }
  document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.querySelector('.username-field').value;
    const password = document.querySelector('.password-field').value;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password');
    }
  });
});
