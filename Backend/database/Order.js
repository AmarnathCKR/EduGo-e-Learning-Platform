
const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,

        required: true,
    },

    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: "Coupon",
    },
    discount: {
        type: String,
        required: true,
    },
    final: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
    },

    amount: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;