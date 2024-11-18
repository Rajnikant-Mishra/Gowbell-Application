import { db } from '../../config/db.js';

export const Book = {
  create: (bookData, callback) => {
    const { name, publishedyear, class_name, quantity } = bookData;
    const query = 'INSERT INTO books (name, publishedyear, class_name, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
    db.query(query, [name, publishedyear, class_name, quantity], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM books';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM books WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, bookData, callback) => {
    const { name, publishedyear, class_name, quantity } = bookData;
    const query = 'UPDATE books SET name = ?, publishedyear = ?, class_name = ?, quantity = ?, updated_at = NOW() WHERE id = ?';
    db.query(query, [name, publishedyear, class_name, quantity, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM books WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export default Book;
