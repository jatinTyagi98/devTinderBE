const express = require('express');

const app = express();


app.use('/user', (req, res, next) => {
    console.log("Route 1")
    next();
},
[(req, res, next) => {
    console.log("Route 2")
    next();
},
(req, res, next) => {
    console.log("Route 3")
    next();
}],(req, res, next) => {
    console.log("Route 4")
    res.send('4th route')
}
);

//query params

// app.get("/user/:userId/:name/:password", (req, res) => {
//     //console.log(req.params);
//     res.send({ user: "Jatin Tyagi", age: "27", location: "Delhi" });
// });


app.listen(3000, () => {
    console.log('Server is running on port 3000 successfully!!!');
});