const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
let books = require("./booksdb.js");
const regd_users = express.Router();
const jwtSecret = "papa";

let users = [
  {
    username: "test",
    password: "test123",
  },
];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let authUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return !!authUser;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).send("Please Enter full details");
  }
  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ password }, jwtSecret, { expiresIn: 60 * 60 });
      req.session.authorization = { token, username };
      return res.status(200).send("Customer successfully logged in");
    }
    return res.status(401).send("Incorrect Password");
  }
  return res.status(401).send("Incorrect Username");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  books[isbn].reviews = review;
  return res
    .status(200)
    .send(`The review for the book ISBN ${isbn} has been added/updated`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization["username"];
  const isbn = req.params.isbn;
  books[isbn].reviews = "";
  return res
    .status(200)
    .send(
      `The review for the ISBN ${isbn} posted by the user ${username} deleted`
    );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
