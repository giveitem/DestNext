const Park = require('../models/park');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', { parks });
}
module.exports.show = async (req, res) => {
    const park = await Park.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!park) {
        req.flash('error', 'Park not found');
        return res.redirect('/parks');
    }

    res.render('parks/show', { park, msg: res.locals.success });
}
module.exports.renderNew = async (req, res) => {
    res.render('parks/new');
}
module.exports.createNew = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({ query: req.body.park.location }).send();
    const park = new Park(req.body.park);
    park.image = req.files.map(file => ({ url: file.path, filename: file.filename }));
    park.geometry = geoData.body.features[0].geometry;
    park.author = req.user._id;
    await park.save();
    req.flash('success', 'Park created successfully');
    res.redirect('/parks/' + park._id);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    if (!park.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this park');
        return res.redirect('/parks/' + id);
    }
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    park.image.push(...imgs);
    await park.save();
    if (req.body.deleteImages) {
        console.log(req.body.deleteImages);
        await park.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Park updated successfully');
    res.redirect('/parks/' + park._id);
}
module.exports.renderEdit = async (req, res) => {
    const park = await Park.findById(req.params.id);
    if (!park) {
        req.flash('error', 'Park not found');
        return res.redirect('/parks');
    }
    res.render('parks/edit', { park });
}

module.exports.delete = async (req, res) => {
    await Park.findByIdAndDelete(req.params.id);
    req.flash('success', 'Park successfully deleted');
    res.redirect('/parks');
}