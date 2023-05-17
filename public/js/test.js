
// const { Highscore } = require("../../models");
// const router = require('express').Router();

setTimeout(async function () {
  let savedScore = await JSON.parse(localStorage.getItem("highScores")) || [];

  const temp = savedScore[savedScore.length - 1]; 

  const response = await fetch('/api/highscore', {
    method: "POST",
    body: JSON.stringify(temp),
    headers: { "Content-Type": "application/json" },
  });
  
  let newResponse = await response.json()
  console.log(newResponse)

  console.log(newResponse.score)
  console.log(temp.score)
 




  if (response.ok) { 
    // document.location.replace('/games');
  } else {
    alert(response.statusText);
  }
  
}, 1000); 

// module.exports = router;