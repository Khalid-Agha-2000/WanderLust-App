const express = require("express");
const router = express.Router();

// signup form page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});


module.exports = router;