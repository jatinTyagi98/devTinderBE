const mongoose = require('mongoose');

//it is not a good practice to call it like this, instead we should convert it into an async function

const connectDB = async () => {
        await mongoose.connect('mongodb+srv://jatinreact_db_user:gS7dnyqXzMhbu5XK@learnbackend.vdkgdnp.mongodb.net/devTinderDb');
}

module.exports = connectDB