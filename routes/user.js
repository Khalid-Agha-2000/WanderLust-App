const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");


// signup routes combined, GET & POST
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


// login routes combined, GET & POST
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", 
        {failureRedirect: "/login",
        failureFlash: true}),
        userController.login);

// logout route
router.get("/logout", userController.logout);


module.exports = router;