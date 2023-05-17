// const { Highscore } = require('../../models');
// const { User } = require('../../models');
// const router = require('express').Router();

// let playerScore = document.querySelector('#playerScore')  

// setTimeout( async function(req,res,next){   

//     savedScore = JSON.parse(localStorage.getItem("highscores")) || [];

//  await Highscore.create({
//     score: playerScore.savedScore[-1],
//     user_id: req.session.user_id,
// })
 

// next();
  
// },10000);

// module.exports = router;



// function getFromLocalStorage(highScores, defaultVal){
//     if (typeof Storage !== "undefined"){
//         if (localStorage.getItem(highScores)){
//             return localStorage.getItem(highScores);
//         }
//     }
//     return defaultVal
// }

// function watchLocalStorage(highScores, cb){
//     window.addEventListener("storage", function(event){
//         if (event.highScores === highScores){
//             let newScore = event.newScore;
//             cb(newScore);
//         }
//     })
// }

// watchLocalStorage("highScores", function(newScore){
//     console.log(newScore);
//     renderScore(newScore);
// })

// function renderScore(score){
//     document.getElementById('HTML-TagWhereItGoes').textContent = score;
// }