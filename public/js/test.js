// const { Highscore } = require('../../models');
// const { User } = require('../../models');
// const router = require('express').Router();

let playerScore = document.querySelector('#playerScore')  

setTimeout( async function(req,res,next){   

    savedScore = JSON.parse(localStorage.getItem("highscores")) || [];

 await Highscore.create({
    score: playerScore.savedScore[-1],
    user_id: req.session.user_id,
})
 

next();
  
},10000);

// module.exports = router;