const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: 'string',
    base: BaseJoi.string(),
    messages: { 'string.escapeHTML': '{{#label}} must be a valid HTML string!' },
    rules: {
        escapeHTML: {
            validate: (value, helpers) => {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) {
                    return helpers.error('escapeHTML', { value });
                }
                return clean;
            }
        }
    }
})
const Joi = BaseJoi.extend(extension);
module.exports.parkSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0)
    }).required(),
    deleteImages: Joi.array()
});




module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});