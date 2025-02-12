document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'index.html';
  }

  document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.querySelector('.username-field').value;
    const email = document.querySelector('.email-field').value;
    const password = document.querySelector('.password-field').value;
    
    // Basic validation
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (existingUsers.some(user => user.username === username)) {
      alert('Username already exists. Please choose another one.');
      return;
    }
    
    // Check if email already exists
    if (existingUsers.some(user => user.email === email)) {
      alert('Email already exists. Please use a different email.');
      return;
    }
    
    // Add new user
    existingUsers.push({
      username,
      email,
      password // In a real app, this should be hashed
    });
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Show success message and redirect
    alert('Account created successfully! Please log in.');
    window.location.href = 'login.html';
  });
});
