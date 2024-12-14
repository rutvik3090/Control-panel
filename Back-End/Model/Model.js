const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true, // Ensure username is unique
    },
    email: {
        type: String,
        required: true,
        // unique: true, 
    },
    password:
    {
        type: String,
        required: true
    },
});

// You can hash the password before saving it
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
