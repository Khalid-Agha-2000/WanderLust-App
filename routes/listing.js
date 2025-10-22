const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

// /listings routes combined
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );

// create listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// search route
router.get("/search", listingController.search);

// /:id routes combined
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));


// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// category route
router.get("/category/:category", wrapAsync(listingController.renderCategory));


module.exports = router;