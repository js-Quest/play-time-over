 

 ////this function captures the SCORE from local storage after a certain amount time (the amount of time it takes for the game to complete) AND THEN it POSTS or UPDATES the score to the HIGHSCORE in the database based on conditional logic

setTimeout( async function () { 

  let savedScore = await JSON.parse(localStorage.getItem("highScores")) || []; 
  const temp = await savedScore[savedScore.length - 1]; 


  ////////////////// get route to grab any existing highscore, or UNDEFINED
    const response = await fetch('/api/highscore', {
        method: "GET", 
        headers: { "Content-Type": "application/json" },
      });
 

    let existingScore = await response.json()  


    if (!existingScore.score){
      ///run a POST route IF no existing HIGHSCORE for the user 
      const newResponse = await fetch('/api/highscore', {
      method: "POST",
      body: JSON.stringify(temp),
      headers: { "Content-Type": "application/json" },
      });

    } else if (existingScore.score<temp.score){ 

    const response = await fetch('/api/highscore', {
    method: "PUT",
    body: JSON.stringify(temp),
    headers: { "Content-Type": "application/json" },
    });

    } else {
      //if the newScore is WORSE than or equal to Existing Score, nothing happens
      console.log("Better luck next time!")

    }
 
  
}, 10000); 
 
