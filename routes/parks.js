const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Park = require('../models/park');
const { isLoggedIn, isAuthor, validatePark } = require('../middleware.js');
const parks = require('../controllers/parks');
const reviews = require('../controllers/reviews');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// router.get('/newpark', catchAsync(async (req, res) => {
//     const park = new Park({ title: 'One Park' })
//     await park.save();
//     res.send(park);
// }))
router.get('/new', isLoggedIn, parks.renderNew);

router.route('/')
    .get(catchAsync(parks.index))
    .post(isLoggedIn, upload.array('image'), validatePark, catchAsync(parks.createNew));

router.route('/:id')
    .get(catchAsync(parks.show))
    .put(isLoggedIn, upload.array('image'), validatePark, catchAsync(parks.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(parks.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parks.renderEdit));


module.exports = router;
