const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/verify-token', authController.verifyToken);

router.post("/", usersController.createUser);
router.get("/:id", usersController.getUserById);
router.get("/", usersController.listUsers);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
