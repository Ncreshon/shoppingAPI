const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "testing";
// const someOtherPlaintextPassword = 'testing';

const salt = bcrypt.genSaltSync(saltRounds);

//USE TO ENCRYPT PASSWORD
const hash = bcrypt.hashSync(myPlaintextPassword, salt);

//USE TO CHECK PASSWORD
bcrypt.compareSync(myPlaintextPassword, hash);

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://Nerdy_girl:KmD5CvURp9VLU3E@ngwd.7s3aa.mongodb.net/NGWD?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// GET USERS
app.get("/users", function (req, res) {
  const user = req.query.user;
  const pass = req.query.pass;

  client.connect((err, db) => {
    const Users = client.db("Shopping_List").collection("Users");

    if (err) throw err;

    Users.find({ username: user }).toArray(function (err, result) {
      if (err) throw err;


      //Compare Password
      if (bcrypt.compareSync(pass, result[0].password)) {
        res.send(result);
      } else {
        res.send("Invalid Password");
      }
    });
  });
});


// app.post("/users", function (req, res) {
//   res.send("We getting money");
// });

// LIST

//get Lists where username 
app.get("/lists", function (req, res) {
    const user = req.query.user;
    // const pass = req.query.pass;
  
    client.connect((err, db) => {
      const Users = client.db("Shopping_List").collection("Lists");
  
      if (err) throw err;
  
      Users.find({ username: user }).toArray(function (err, result) {
        if (err) throw err;
  
  
        //Compare Password
      res.send(result)
      });
    });
});



app.post("/lists", function (req, res) {
  res.send(req.body);
  client.connect((err, db) => {
    const Users = client.db("Shopping_List").collection("Lists");

    if (err) throw err;

    Users.insertOne({
        username: req.body.username,
        listName: req.body.listName,
        listItems: req.body.listItems,
      }).then((response) => { 
          res.send('List Saved')
      }).catch(err => {
          console.error(err)
      })

  });





});













app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
