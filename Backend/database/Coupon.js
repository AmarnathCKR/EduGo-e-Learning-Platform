
const mongoose = require("mongoose");


const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        
        required: true,
    },

    discount: {
        type: String,
    },
    status: {
        type: Boolean,
        required: true,
    },



    expirationTime: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;