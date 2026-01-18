const express = require('express');

const app = express();

app.get("/user", (req, res) => {
    res.send({ user: "Jatin Tyagi", age: "27", location: "Delhi" });
});

app.post("/user", (req, res) => {
    //save in db
    res.send("User created successfully!!!");
});

app.delete("/user", (req, res) => {
    //delete from db
    res.send("User deleted successfully!!!");  
})


app.use("/about", (req, res) => {
    res.send("I am Jatin Tyagi but you can call me DADDY ;)");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000 successfully!!!');
});