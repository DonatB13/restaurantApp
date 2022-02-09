const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    favoriteItems: [String],
    cartItems: [String],
    admin: {
        type: Boolean,
        required: true
    },
    resetPasswordCode: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Account = mongoose.model('account', accountSchema);


module.exports = Account;