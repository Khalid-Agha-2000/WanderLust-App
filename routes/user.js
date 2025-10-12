const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../public/utils/wrapAsync.js")

// signup form page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// signup route
router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let { username, email, password } = req.body;
    let newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// user login form
router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});


module.exports = router;