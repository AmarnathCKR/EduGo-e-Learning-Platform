const validator = require("validator");

const instructorProfileValidator = (req, res, next) => {
  const {
    name,
    image,
    headline,
    description,
    country,
    region,
    git,
    linkedin,
    facebook,
    twitter,
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

  if (!validator.isLength(country, { max: 50 })) {
    errors.country = "Country must be less than 50 characters";
  }

  if (!validator.isLength(region, { max: 50 })) {
    errors.region = "Region must be less than 50 characters";
  }

  if (!validator.isURL(git)) {
    errors.git = "Invalid git URL";
  }

  if (!validator.isURL(linkedin)) {
    errors.linkedin = "Invalid LinkedIn URL";
  }

  if (!validator.isURL(facebook)) {
    errors.facebook = "Invalid Facebook URL";
  }

  if (!validator.isURL(twitter)) {
    errors.twitter = "Invalid Twitter URL";
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

module.exports = instructorProfileValidator;
