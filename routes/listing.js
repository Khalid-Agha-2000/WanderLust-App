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
    // .post(
    //     isLoggedIn,
    //     validateListing,
    //     wrapAsync(listingController.createListing)
    // );
    .post(upload.single('listing[image]'), (req, res) => {
        res.send(req.file);
    });

// create listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);


// /:id routes combined
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));


// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;