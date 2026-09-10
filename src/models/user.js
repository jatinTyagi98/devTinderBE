const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 15,
        required: true,
        lowercase: true
    },
    lastName: {
        type: String,
        minLength: 3,
        lowercase: true,
        maxLength: 15
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)) {
                throw new Error("invalid gender!!!, Allowed values are: male, female, others")
            }
        }
    },
    number: {
        type: Number,
        min: 10,
        required: true
    },
    email: {
        type: String,
        lowercase:true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email!!!" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
        required: true
    },
    skills: {
        type: [String],
        lowercase: true
    },
    city : {
        type: String,
        required: true,
        lowercase: true
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;