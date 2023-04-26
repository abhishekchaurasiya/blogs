const joi = require("joi")
const postShcema = joi.object({
    title: joi.string().min(3).required(),
    author: joi.string().min(2).required(),
    category: joi.string().min(2).required(),
    content: joi.string().min(5).required(),
    image:joi.string()
});

module.exports = postShcema;