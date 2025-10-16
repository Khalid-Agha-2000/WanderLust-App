const Review = require("../Models/review");
const Listing = require("../Models/listing");

// create review route
module.exports.createReview = async(req, res) => {
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
};

// delete review route
module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted", "Review was Deleted!");
    res.redirect(`/listings/${id}`);
};