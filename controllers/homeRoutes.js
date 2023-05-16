const router = require("express").Router(); 
const withAuth = require('../utils/auth');
const { Highscore, User } = require('../models');

router.get("/", async (req, res) => {
    try { 
      if(req.session.logged_in){

        const highscoreData = await Highscore.findAll({
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
        });
 
        const highscores = highscoreData.map((highscore) =>
        highscore.get({ plain: true })
        );  

        highscores.sort((a,b) => b.score - a.score)  

        res.render("games",{   
          highscores,
          loggedUser: req.session.name,
          logged_in: req.session.logged_in 

        }); 

      } else {
        res.render("homepage",{  
          loggedUser: req.session.name,
          logged_in: req.session.logged_in 
        }); 
      }

    } catch (err) {
      res.status(500).json(err);
    }
  });

  // router.get("/homepage", async (req, res) => {
  //   try { 

  //     if(req.session.logged_in){
  //       res.render("/games",{  
  //         loggedUser: req.session.name,
  //         logged_in: req.session.logged_in 
  //       }); 

  //     }
  //       res.render("homepage", {  
  //         loggedUser: req.session.name,
  //         logged_in: req.session.logged_in 
  //       }); 
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });

  router.get("/games", withAuth, async (req, res) => {
    try { 
      const highscoreData = await Highscore.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      const highscores = highscoreData.map((highscore) =>
      highscore.get({ plain: true })
      ); 
    
      highscores.sort((a,b) => b.score - a.score)  

        res.render("games", {  
          highscores,
          loggedUser: req.session.name,
          logged_in: req.session.logged_in 
        }); 
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get("/login", (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect("/homepage", {  
        loggedUser: req.session.name,
        logged_in: req.session.logged_in 
      });
      return;
    } 
    res.render("login"); 

  });

  router.get("/signup", (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect("/homepage", {  
        loggedUser: req.session.name,
        logged_in: req.session.logged_in 
      });
      return;
    } 
    res.render("signup"); 

  });

router.get("/game", (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render("games");
});

  module.exports = router;
