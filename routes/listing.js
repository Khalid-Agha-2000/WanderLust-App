const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const expressError = require("../public/utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../Models/listing.js");



// schema validation middlewares
// validation for listing
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

// create route / add new listing
router.get("/add", (req, res) => {
    res.render("listings/new.ejs");
});

// edit form route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.patch("/:id", validateListing,  wrapAsync(async (req, res) => {
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
        // await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// add route
router.post("/", validateListing, wrapAsync(async(req, res, next) => {
    const newListing = new Listings(req.body.listing);
    await newListing.save();    
    res.redirect("/listings");
}));

module.exports = router;