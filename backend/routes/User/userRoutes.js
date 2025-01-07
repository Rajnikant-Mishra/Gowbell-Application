import express from 'express';
import usersController from '../../controllers/User/userController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/users', usersController.createUser);
router.post('/users/login', usersController.loginUser);
router.post('/users/logout', usersController.logoutUser);
router.get('/users',  usersController.getAllUsers);
router.get('/users/:id', verifyToken, usersController.getUserById);
router.put('/users/:id',  usersController.updateUser);
router.delete('/users/:id', verifyToken, usersController.deleteUser);

export default router;
