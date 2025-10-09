const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./public/utils/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


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



// root
app.get("/", (req, res) => {
    res.send("Server is working");
});

// connecting to routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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