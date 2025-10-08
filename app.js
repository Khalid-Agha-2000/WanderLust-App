    const express = require("express");
    const app = express();
    const mongoose = require("mongoose");
    const port = 8080;
    const Listing = require("./Models/listing.js");
    const path = require("path");
    const methodOverride = require("method-override");
    const ejsMate = require("ejs-mate");
    const wrapAsync = require("./public/utils/wrapAsync.js");
    const expressError = require("./public/utils/expressError.js");
    const {listingSchema, reviewSchema} = require("./schema.js");
    const Review = require("./Models/review.js");


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

    //validation for review
    const validateReview = (req, res, next) => {
        let {error} = reviewSchema.validate(req.body);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, errMsg);
        } else {
            next();
        }
    }


    //Routes
    //index route
    app.get("/listings", wrapAsync(async (req, res) => {
        const allListings = await Listing.find();
        res.render("listings/index.ejs", {allListings});
    }));

    // create route / add new listing
    app.get("/listings/add", (req, res) => {
        res.render("listings/new.ejs");
    });

    // edit form route
    app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
    }));

    // update route
    app.patch("/listings/:id", validateListing,  wrapAsync(async (req, res) => {
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
    app.get("/listings/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    }));

    // Delete route
    app.delete("/listings/:id", wrapAsync(async (req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    }));

    // add route
    app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
        const newListing = new Listings(req.body.listing);
        await newListing.save();    
        res.redirect("/listings");
    }));

    // reviews
    //Post Route
    app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        console.log("New review saved");
        res.redirect(`/listings/${listing._id}`);
    }));



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

    app.listen(port, () => {
        console.log("listening to port: ", port);
    });