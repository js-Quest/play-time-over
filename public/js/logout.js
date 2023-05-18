

///upon logout, fetch request to DESTROY the req.session, then render the homepage 
const logout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  };


  ///a simple function button to re-render the games.handlebars 
  const playAgain = () => {

    document.location.replace('/games');

  } 
  const secretLevel = () => {

    document.location.replace('/level2'); 

  }
  
  document.querySelector('#logout').addEventListener('click', logout);
  document.querySelector('#playAgain').addEventListener('click', playAgain); 
  document.querySelector('#level2').addEventListener('click', secretLevel); 