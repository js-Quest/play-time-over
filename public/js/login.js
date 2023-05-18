
///captures html elements, then passes them to check if user exists, and if exsits and password is correct, then make a req.sessions and reload the page to the games.handlebars

const loginFormHandler = async (event) => {
    event.preventDefault();
   
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) { 
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) { 
        document.location.replace('/games');
      } else {
        alert('Not a valid email and/or password, sign up or try again!');
      }
    }
  };

  document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);