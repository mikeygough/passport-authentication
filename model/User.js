// const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});


/**
 * passport-local-mongoose will add an hash and salt to out Schema 
 * so that we save hashed password and the salt value
 */
UserSchema.plugin(passportLocalMongoose);

/* REGISTER SOME USERS */

UserSchema.register({username:'paul', active: false}, 'paul');
UserSchema.register({username:'jay', active: false}, 'jay');
UserSchema.register({username:'roy', active: false}, 'roy');

module.exports = mongoose.model("User", UserSchema);
