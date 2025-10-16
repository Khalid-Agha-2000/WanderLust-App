const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


// index route
router.get("/", wrapAsync(listingController.index));

// create listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// update route
router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// add listing route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

module.exports = router;