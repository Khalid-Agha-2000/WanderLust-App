const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listings = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


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

// test listing
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Gawadar",
//         country: "Pakistan"
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Success");
// });

//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listings.find();
    res.render("listings/index.ejs", {allListings});
});


// edit form route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// update route
app.patch("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// create route / add new listing
app.get("/listings/add", (req, res) => {
    res.render("listings/new.ejs");
});

// Delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
});

// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show.ejs", { listing });
});

app.post("/listings", async(req, res) => {
    const newListing = new Listings(req.body.listing);
    newListing.save()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect("/listings");
});

app.listen(port, () => {
    console.log("listening to port: ", port);
});