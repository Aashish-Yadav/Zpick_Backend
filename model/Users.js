const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    profileImage: {
        type: String,
        default: ""
    },
    profileImagePublicId: {
        type: String,
        default: ""
    }
});



module.exports = mongoose.model("User", UserSchema);