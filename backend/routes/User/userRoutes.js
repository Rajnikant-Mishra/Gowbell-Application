import express from 'express';
import usersController from '../../controllers/User/userController.js';


const router = express.Router();

router.post('/users', usersController.createUser);
router.post('/users/login', usersController.loginUser);
router.post('/users/logout', usersController.logoutUser);
router.get('/users',  usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.put('/users/:id',  usersController.updateUser);
router.delete('/users/:id',  usersController.deleteUser);

export default router;
