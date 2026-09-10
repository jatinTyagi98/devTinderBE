const validator = require('validator');

const validateSignUpData = (data) => {
    const { firstName, lastName, email, password } = data;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    if(!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid");
    }
}

module.exports = {
    validateSignUpData
};