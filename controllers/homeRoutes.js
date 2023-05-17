const router = require("express").Router();
const withAuth = require("../utils/auth");
const { Highscore, User } = require("../models");


////this route will  will render either games.handlebars or homepage.handlebars, depending on req.session.logged_in, but in either case, 
///will pass an array of the highscores in reverse sorted order to be used and rendered to both pages
router.get("/", async (req, res) => { 

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

    highscores.sort((a, b) => b.score - a.score); 


    if (req.session.logged_in) {
  

      res.render("games", {
        highscores,
        loggedUser: req.session.name,
        logged_in: req.session.logged_in,
      });

 

    } else {
      res.render("homepage", {
        highscores,
        loggedUser: req.session.name,
        logged_in: req.session.logged_in,
      });
    }


  } catch (err) {
    res.status(500).json(err);
  }
}); 


///when /games is called directly, withAuth will validate req.session, if bad, redirects to homepage. else, renders highscores to page
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

    highscores.sort((a, b) => b.score - a.score);

    res.render("games", {
      highscores,
      loggedUser: req.session.name,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


///login route renders login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/homepage", {
      loggedUser: req.session.name,
      logged_in: req.session.logged_in,
    });
    return;
  }
  res.render("login");
});

///signup route renders signup page 
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/homepage", {
      loggedUser: req.session.name,
      logged_in: req.session.logged_in,
    });
    return;
  }
  res.render("signup");
});

 
router.get("/level2", withAuth, async (req, res) => {
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

    highscores.sort((a, b) => b.score - a.score);

    res.render("level2", {
      highscores,
      loggedUser: req.session.name,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/level2", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("level2");
});



module.exports = router;
