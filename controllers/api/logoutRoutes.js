const router = require('express').Router();
const { User } = require('../../models');



///this route destorys req.session, then re-routes to home page (from the event handler)
router.post('/', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }

    
  });

  module.exports = router;