 

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
      console.log('Run my hisghscore POST route')
      const newResponse = await fetch('/api/highscore', {
      method: "POST",
      body: JSON.stringify(temp),
      headers: { "Content-Type": "application/json" },
      });

    } else if (existingScore.score<temp.score){
      console.log('Run my highscore PUT route')

    const response = await fetch('/api/highscore', {
    method: "PUT",
    body: JSON.stringify(temp),
    headers: { "Content-Type": "application/json" },
    });

    } else {
      //if the newScore is WORSE than or equal to Existing Score, nothing happens
      console.log("they are equal/or the temp score is worse than existing") 

    }

    console.log(existingScore.score)
    console.log(temp.score)  
  
}, 10000); 
 
