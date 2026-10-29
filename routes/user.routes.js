const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login',userController.login);
router.get('/getalluser',authMiddleware ,userController.getAllUsers);
router.get('/getalluserwithoutpop',authMiddleware,userController.getAllUsersWithoutpop);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/profile', authMiddleware, userController.addUserProfile);

module.exports=router;
