import { Book } from '../../models/Inventory/bookModel.js';

// Create a new book
export const createBook = (req, res) => {
  const { name, publishedyear, class_name, quantity } = req.body;
  const newBook = { name, publishedyear, class_name, quantity };

  Book.create(newBook, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Book created', bookId: result.insertId });
  });
};

// Get all books
export const getAllBooks = (req, res) => {
  Book.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

// Get a single book by ID
export const getBookById = (req, res) => {
  const { id } = req.params;
  Book.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Book not found');
    res.status(200).send(result[0]);
  });
};

// Update a book by ID
export const updateBook = (req, res) => {
  const { id } = req.params;
  const { name, publishedyear, class_name, quantity } = req.body;
  const updatedBook = { name, publishedyear, class_name, quantity };

  Book.update(id, updatedBook, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Book not found');
    res.status(200).send({ message: 'Book updated' });
  });
};

// Delete a book by ID
export const deleteBook = (req, res) => {
  const { id } = req.params;
  Book.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Book not found');
    res.status(200).send({ message: 'Book deleted' });
  });
};
