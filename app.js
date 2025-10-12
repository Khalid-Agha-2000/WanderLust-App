const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
// const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./public/utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// main
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
};

// root
app.get("/", (req, res) => {
    res.send("Server is working");
});

// session and flash
app.use(session(sessionOptions));
app.use(flash());

// using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// using flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    next();
});

// connecting to routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// all invalid routes
app.all("/*splat", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// error handler if wrong data entered on add new listing from
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.status(statusCode).render("error.ejs", {err});
});

// servers
app.listen(port, () => {
    console.log("listening to port: ", port);
});