const validator = require("validator");

const instructorCourseValidator = (req, res, next) => {
    const {
        name,
        image,
        headline,
        description,
        price,
        total,


    } = req.body;

    let errors = {};

    if (!validator.isLength(name, { min: 7, max: 50 })) {
        errors.name = "Name must be between 7 and 50 characters";
    }

    if (!validator.isURL(image)) {
        errors.image = "Invalid image URL";
    }

    if (!validator.isLength(headline, { min: 100, max: 200 })) {
        errors.headline = "Headline must be less than 200 characters";
    }

    if (!validator.isLength(description, { min: 200, max: 550 })) {
        errors.description =
            "Description must be more than 200 and less than 650 characters";
    }
    if (!validator.isLength(description, { min: 200, max: 550 })) {
        errors.description =
            "Description must be more than 200 and less than 650 characters";
    }
    if (!validator.isNumeric(price)) {
        errors.price = "Price must be a number";
    } else if (Number(price) < 500) {
        errors.price = "Price must be greater than or equal to 500";
    }

    if (!validator.isNumeric(total)) {
        errors.total = "Total must be a number";
    } else if (Number(total) < 1) {
        errors.total = "Total must be greater than or equal to 1 hour";
    }

    if (Object.keys(errors).length > 0) {
        const emailError = {
            status: false,
            errors: errors,
        };

        return res.status(409).send({ data: emailError });
    }

    next();
};

module.exports = instructorCourseValidator;
