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

  const playAgain = () => {

    document.location.replace('/');

  }

  
  document.querySelector('#logout').addEventListener('click', logout);
  document.querySelector('#playAgain').addEventListener('click', playAgain);
  