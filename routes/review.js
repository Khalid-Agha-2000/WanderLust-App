const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../public/utils/wrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");




// reviews
// post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// delete Review Route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;