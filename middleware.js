const ExpressError = require('./utils/ExpressError');
const { parkSchema, reviewSchema } = require('./schemas.js');
const Park = require('./models/park');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if (!park.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this park');
        return res.redirect('/parks/' + id);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this park');
        return res.redirect('/parks/' + id);
    }
    next();
}
module.exports.validatePark = (req, res, next) => {
    const result = parkSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error.details[0].message, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        console.log(error);
        throw new ExpressError(error.details[0].message, 400);
    }
    else {
        next();
    }
}