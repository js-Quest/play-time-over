const router = require("express").Router(); 

router.get("/", async (req, res) => {
    try { 
        res.render("homepage",{  
          loggedUser: req.session.name,
          logged_in: req.session.logged_in 
        }); 
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/homepage", async (req, res) => {
    try { 
        res.render("homepage", {  
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



  module.exports = router;
