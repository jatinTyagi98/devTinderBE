const express = require('express');
const connectDB = require('./config/database')
const User  = require("./models/user");
const { validateSignUpData } = require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

//our server is gonna receive the data in json format, so we need to use a middleware to parse json data
app.use(express.json());


//signup api call

app.post('/signup', async (req, res) => {
    //validate the data
    validateSignUpData(req.body);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        res.status(201).send("User created successfully!!!", user);

    }catch(err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user');
    }
});


//login api call
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
         const user = await User.findOne({ email });

        if(!user) {
            res.status(404).send("User not found!!!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {

            let token = jwt.sign({ _id: user._id}, "JATIN_TYAGI@123")

            res.cookie('token', token);
            res.status(200).send("Login successful!!! Welcome " + user.firstName);
        } else {
            res.status(401).send("Invalid password!!!");
        }
    } catch(err) {
        console.error('Error logging in user:', err);
        res.status(500).send("Something went wrong!!");
    }

});

//profile api call
app.get('/profile', async (req, res) => {

    try {
        const cookie = req.cookies;

        const { token } = cookie;

        if(!token) {
            res.status(401).send("Invalid token!!!");
        }

        //validate the token
        const decodedMessage = jwt.verify(token, "JATIN_TYAGI@123");

        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if(!user) {
            res.status(404).send("User not found!!!");
        }
        res.status(200).send(user.firstName + " " + user.lastName + " is logged in!!!");

    } catch(err) {
        console.error('Error fetching profile:', err);
        res.status(500).send("Something went wrong!!");
    }
})

//post call to add user
app.post('/user', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save();
        res.status(200).send("User added successfully", user);
    } catch (err) {
        if(err.name === 'ValidatorError') {
            console.error('Validation error:', err)
            return res.status(400).send("Invalid email id")
        }
        console.error('Error creating user', err);
        res.status(500).send("Can't create user")
    }
})

//Update user by id

app.patch('/user/:id', async (req, res) => {
    const userId = req?.params?.id;
    const data = req?.body;
    
    try {
        const allowedUpdateFields = ['number', 'skills', 'lastName', 'city'];
        const isValidUpdate = Object.keys(data).every((field) => allowedUpdateFields.includes(field));
        if(!isValidUpdate) {
            return res.status(400).send("Invalid update fields!!!, Allowed fields are: number, skills, lastName, city");
        }
        if(data?.skills?.length > 5) {
            return res.status(400).send("Skills can't be more than 5!!!");
        }
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });
        res.status(200).send("User updated successfully!!!", user);
    } catch(err) {
        console.error('Error updating user:', err);
        res.send(400).send("Something went wrong!!");
    }
})

//get call to fetch a user by email

app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.findOne({ email: userEmail });
        if(!users) {
            res.status(404).send("User not found!!!");
        } else {
            res.status(200).send(users);
        }
    } catch(err) {
        console.error('Error fetching user:', err);
        res.status(500).send("Something went wrong!!");
    }
});

app.get('/all_users', async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users)
    } catch(err) {
        console.error('Error Fetching Users:', err);
        res.status(500).send("Something went wrong!!");
    }
})

//get user by id

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            res.status(404).send("User not foumd!!!");
        } else {
            res.status(200).send(user);
        }
    } catch(err) {
        console.error('Error fetching user:', err);
        res.status(500).send("Something went wrong!!");
    }
})

//delete user by id

app.delete('/user', async (req, res) => {
    const userId = req.body.id;
    try{
        const user = await User.findByIdAndDelete(userId);

        if(!user) {
           return res.status(404).send("User not found!!!");
        }
        res.status(200).send("User deleted successfully!!!");
    } catch(err) {
        console.error('Error deleting user:', err);
        res.status(500).send("Something went wrong!!");
    }
})

app.patch('/user', async (req, res) => {
    const userEmail = req.body.email;
    const data = req.body;
    console.log(userEmail, data)
    try {
        const user = await User.findOneAndUpdate({email: userEmail}, data, {
            runValidators: true,
        });
        console.log({ user })
        if(!user) {
           return res.status(400).send("User doesn't exist");
        }
        return res.status(200).send("User updated successfully");
    }
    catch (err) {
        console.error("Error Updating user: ", err.message);
        return res.status(500).send(err.message);
    }
})


//Always connect db first and then start the server, 
// otherwise if we start the server first and then connect to db, 
// there is a possibility that db connection might fail and our server will be running without db connection which is not a good practice.
// So we should always connect to db first and then start the server.

connectDB().then(() => {
    console.log('Database connected successfully!!!');
    app.listen(3000, () => {
        console.log('Server is running on port 3000 successfully!!!');
    });
}).catch((err) => {
    console.error('Database connection failed!!!', err);
})



// app.use('/user',  (req, res, next) => {
//     console.log("Route 1")
//     next();
// },
// [(req, res, next) => {
//     console.log("Route 2")
//     next();
// },
// (req, res, next) => {
//     console.log("Route 3")
//     next();
// }],(req, res, next) => {
//     console.log("Route 4")
//     res.send('4th route')
// }
// );

//query params

// app.get("/user/:userId/:name/:password", (req, res) => {
//     //console.log(req.params);
//     res.send({ user: "Jatin Tyagi", age: "27", location: "Delhi" });
// });

//Application level middleware

// app.use((req, res, next) => {
//     console.log('Time', Date.now());
//     next();
// })

// // It can also be written as 
// for GET type of HTTP request, this is how mounted middleware function is gonna handle it

// app.get('/user', (req, res,next) => {
//     console.log('Time', Date.now());
//     res.send('USER')
// }), 

// for any type of HTTP request, this is how mounted middleware function is gonna handle it

// app.use('/user/:id', (req, res, next) => {
//     console.log('Request type', req.method);
//     next();
// })

// Series of middleware functions with a mount path, /user/:id
// app.use('/user/:id', (req, res, next) => {
//     console.log('request handled at first level going to next');
//     next();
// }, (req, res, next) => {
//     console.log('request handled at second level going to next');
//     next();
// })

// app.listen(3000, () => {
//     console.log('Server is running on port 3000 successfully!!!');
// });