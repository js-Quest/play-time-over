const router = require("express").Router();
const { Highscore, User } = require("../../models");


///this ROUTE GRABS any exisiting HIGHSCORE for the currently signed in user, to be used in a conditional statement
router.get("/", async (req, res) => {
  try { 

    const highscoreData = await Highscore.findOne({ where: { user_id: req.session.user_id} });
 
    const highscore = highscoreData.get({plain:true});  

    if (!highscoreData) {
      res.status(404).json({ message: "Category not found with this id!" });
      return;
    }

    res.status(200).json(highscore);
  } catch (err) {
    res.status(500).json(err); 
  }
});


///this route will POST to the HIGHSCORE database if the user DOES NOT have an existing score
router.post("/", async (req, res) => {
  try { 
    const userData = await User.findOne({ where: { id: req.session.user_id} }); 

    const user = userData.get({plain:true}); 

    var temp = {
        score: req.body.score,
        user_id: user.id
    }

    const highscoreData = await Highscore.create(temp); 

    res.status(200).json(highscoreData);
  } catch (err) {
     
    res.status(400).json(err);
  }
});

///this ROUTE will UPDATE an EXISTING Highscore for the user IF the existing HIGHSCORE is less than the new score
router.put("/", async (req, res) => {
  
  try {
    const highscore = await Highscore.update(req.body, {
      where: {
        user_id: req.session.user_id,
      },

    }); 

    res.status(200).json({ message: "NEW SCORE ADDED!" });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
