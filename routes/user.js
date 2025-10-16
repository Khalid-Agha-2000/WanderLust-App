const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../public/utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");
const user = require("../Models/user.js");

// signup form page
router.get("/signup", userController.renderSignupForm);

// signup route
router.post("/signup", wrapAsync(userController.signup));

// user login form
router.get("/login", userController.renderLoginForm);

// Authentication
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect: "/login",
    failureFlash: true}),
    userController.login);

// logout route
router.get("/logout", userController.logout);


module.exports = router;