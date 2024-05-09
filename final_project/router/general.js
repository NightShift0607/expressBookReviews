const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  users.forEach((user) => {
    if (user.username === username)
      return res.status(400).json({ error: "Username already in use." });
  });
  let user = {
    username,
    password,
  };
  users.push(user);
  console.log(user);
  return res
    .status(200)
    .json({ message: "Customer Succesfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKey = keys.find((key) => books[key].author === author);
  const bookByAuthor = {
    isbn: bookKey,
    title: books[bookKey].title,
    reviews: books[bookKey].reviews,
  };
  return res.status(200).json({ bookByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKey = keys.find((key) => books[key].title === title);
  const bookBytitle = {
    isbn: bookKey,
    author: books[bookKey].author,
    reviews: books[bookKey].reviews,
  };
  return res.status(200).json({ bookBytitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
