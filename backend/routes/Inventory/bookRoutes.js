import  express from 'express';

import  {createBook, getAllBooks, getBookById, updateBook, deleteBook} from '../../controllers/Inventory/bookController.js';


const router = express.Router();

// Create a new book
router.post('/book', createBook);

// Get all books
router.get('/book', getAllBooks);

// Get a single book by ID
router.get('/:id', getBookById);

// Update a book by ID
router.put('/:id', updateBook);

// Delete a book by ID
router.delete('/:id', deleteBook);

export default router;
