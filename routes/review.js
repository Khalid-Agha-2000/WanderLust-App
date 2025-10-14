const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../public/utils/wrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { validateReview, isLoggedIn } = require("../middleware.js");




// reviews
// post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    console.log(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

// delete Review Route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted", "Review was Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;