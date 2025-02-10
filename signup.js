document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.signup-form').addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get the form values
      const username = document.querySelector('.username-field').value;
      const email = document.querySelector('.email-field').value;
      const password = document.querySelector('.password-field').value;
      
      // Retrieve existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if the username already exists
      if (existingUsers.some(user => user.username === username)) {
          alert('Username already exists. Please choose another one.');
          return;
      }
      
      // Check if the email already exists (if you want to ensure unique emails as well)
      if (existingUsers.some(user => user.email === email)) {
          alert('Email already exists. Please use a different email.');
          return;
      }
      
      // Add the new user to the list
      existingUsers.push({ username, email, password });
      
      // Store the updated user list in localStorage
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Notify the user and redirect
      alert('Signup successful! You can now login.');
      window.location.href = 'login.html';
  });
});
