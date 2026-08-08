const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseUrl = process.env.BOOKSTORE_BASE_URL || 'http://127.0.0.1:5000';

// This local data endpoint is the JSON data source used by the Axios calls below.
// Keeping it separate makes each public retrieval route asynchronous and testable.
public_users.get('/internal/books', (req, res) => {
  res.status(200).json(books);
});


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} successfully registered` });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/internal/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/internal/books`);
    const book = response.data[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json({ [req.params.isbn]: book });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book', error: error.message });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/internal/books`);
    const searchAuthor = req.params.author.toLowerCase();
    const matchingBooks = Object.fromEntries(
      Object.entries(response.data).filter(([, book]) =>
        book.author.toLowerCase().includes(searchAuthor),
      ),
    );
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books by author', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/internal/books`);
    const searchTitle = req.params.title.toLowerCase();
    const matchingBooks = Object.fromEntries(
      Object.entries(response.data).filter(([, book]) =>
        book.title.toLowerCase().includes(searchTitle),
      ),
    );
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books by title', error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
