const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    review: String,
    title: String,

},
    { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;