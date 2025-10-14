const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

// create listing form
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render("./listings/new.ejs");
});

// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "The listing you are trying to edit does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.patch("/:id", isLoggedIn, isOwner, validateListing,  wrapAsync(async (req, res) => {
    let {id} = req.params;
    const {title, description, price, location, country, image} = req.body.listing;

    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
        country,
        image: { url: image, filename: "listingimage" }   // force image to be an object
    });
    req.flash("success", "Listing was Updated!");
    res.redirect(`/listings/${id}`);
}));

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
        req.flash("error", "The listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing Was Deleted!");
    res.redirect("/listings");
}));

// add listing route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

module.exports = router;