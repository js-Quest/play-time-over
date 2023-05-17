// const { Highscore } = require("../../models");
// const router = require('express').Router();

setTimeout(async function () {
  let savedScore = await JSON.parse(localStorage.getItem("highScores")) || [];

  const temp = savedScore[savedScore.length - 1]; 


  ////////////////// get route to grab any existing highscore, or UNDEFINED
    const response = await fetch('/api/highscore', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

    let existingScore = await response.json()

    if(typeof existingScore === 'undefined'){
      ///run a POST route IF no existing HIGHSCORE for the user
      console.log('Run my hisghscore POST route')
        // const response = await fetch('/api/highscore', {
  //   method: "POST",
  //   body: JSON.stringify(temp),
  //   headers: { "Content-Type": "application/json" },
  // });

    } else if (existingScore.score<temp.score){
      console.log('Run my highscore PUT route')

              // const response = await fetch('/api/highscore', {
  //   method: "PUT",
  //   body: JSON.stringify(temp),
  //   headers: { "Content-Type": "application/json" },
  // });

    } else {
      break;
    }

    console.log(existingScore.score)
    console.log(temp.score) 

  ////////////////////


  
 

  // console.log(newResponse.score)
  // console.log(temp.score) 


  if (response.ok) { 
    // document.location.replace('/games');
  } else {
    alert(response.statusText);
  }
  
}, 1000); 

// module.exports = router;
